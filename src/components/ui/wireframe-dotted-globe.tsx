'use client'

import { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'

import { cn } from '@/lib/utils'

type PolygonGeometry = {
  type: 'Polygon'
  coordinates: number[][][]
}

type MultiPolygonGeometry = {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

type LandGeometry = PolygonGeometry | MultiPolygonGeometry

type LandFeature = {
  type: 'Feature'
  geometry: LandGeometry
  properties?: {
    featurecla?: string
  } | null
}

type LandFeatureCollection = {
  type: 'FeatureCollection'
  features: LandFeature[]
}

type DotData = {
  lng: number
  lat: number
}

type GlobePalette = {
  background: string
  globeFill: string
  outline: string
  graticule: string
  dots: string
  focus: string
  route: string
  label: string
}

type ServiceNode = {
  id: string
  label: string
  lat: number
  lng: number
  role: 'base' | 'market'
  labelOffset: [number, number]
}

type ServiceRoute = {
  from: string
  to: string
}

interface RotatingEarthProps {
  width?: number
  height?: number
  className?: string
  initialRotation?: [number, number]
  rotationSpeed?: number
  scaleMultiplier?: number
  instructionLabel?: string
  isPaused?: boolean
}

type WorldRenderData = {
  landFeatures: LandFeatureCollection
  dots: DotData[]
}

let worldRenderDataPromise: Promise<WorldRenderData> | null = null

const SERVICE_NODES: ServiceNode[] = [
  {
    id: 'alexandria',
    label: 'Alexandria',
    lat: 31.2001,
    lng: 29.9187,
    role: 'base',
    labelOffset: [12, -12],
  },
  {
    id: 'istanbul',
    label: 'Istanbul',
    lat: 41.0082,
    lng: 28.9784,
    role: 'market',
    labelOffset: [9, -14],
  },
]

const SERVICE_ROUTES: ServiceRoute[] = [
  { from: 'alexandria', to: 'istanbul' },
]

const SERVICE_NODE_MAP = new Map(SERVICE_NODES.map((node) => [node.id, node]))

function pointInPolygon(point: [number, number], polygon: number[][]): boolean {
  const [x, y] = point
  let inside = false

  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [xi, yi] = polygon[index]
    const [xj, yj] = polygon[previous]

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside
    }
  }

  return inside
}

function pointInFeature(point: [number, number], feature: LandFeature): boolean {
  const { geometry } = feature

  if (geometry.type === 'Polygon') {
    if (!pointInPolygon(point, geometry.coordinates[0])) {
      return false
    }

    for (let index = 1; index < geometry.coordinates.length; index += 1) {
      if (pointInPolygon(point, geometry.coordinates[index])) {
        return false
      }
    }

    return true
  }

  for (const polygon of geometry.coordinates) {
    if (!pointInPolygon(point, polygon[0])) {
      continue
    }

    let inHole = false

    for (let index = 1; index < polygon.length; index += 1) {
      if (pointInPolygon(point, polygon[index])) {
        inHole = true
        break
      }
    }

    if (!inHole) {
      return true
    }
  }

  return false
}

function generateDotsInFeature(feature: LandFeature, dotSpacing = 16): DotData[] {
  const dots: DotData[] = []
  const [[minLng, minLat], [maxLng, maxLat]] = d3.geoBounds(feature as d3.GeoPermissibleObjects)
  const stepSize = dotSpacing * 0.08

  for (let lng = minLng; lng <= maxLng; lng += stepSize) {
    for (let lat = minLat; lat <= maxLat; lat += stepSize) {
      const point: [number, number] = [lng, lat]

      if (pointInFeature(point, feature)) {
        dots.push({ lng, lat })
      }
    }
  }

  return dots
}

async function loadWorldRenderData(): Promise<WorldRenderData> {
  if (!worldRenderDataPromise) {
    worldRenderDataPromise = (async () => {
      const response = await fetch(
        'https://raw.githubusercontent.com/martynafford/natural-earth-geojson/refs/heads/master/110m/physical/ne_110m_land.json',
      )

      if (!response.ok) {
        throw new Error('Failed to load land data')
      }

      const landFeatures = (await response.json()) as LandFeatureCollection
      const dots = landFeatures.features.flatMap((feature) => generateDotsInFeature(feature, 16))

      return {
        landFeatures,
        dots,
      }
    })()
  }

  return worldRenderDataPromise
}

function readPalette(): GlobePalette {
  const styles = getComputedStyle(document.documentElement)

  return {
    background: styles.getPropertyValue('--color-hero-background').trim() || 'oklch(0.95 0.014 70)',
    globeFill: styles.getPropertyValue('--color-page-background').trim() || 'oklch(0.975 0.006 75)',
    outline: styles.getPropertyValue('--color-accent-primary').trim() || 'oklch(0.63 0.06 28)',
    graticule: styles.getPropertyValue('--color-page-foreground').trim() || 'oklch(0.258 0.03 28)',
    dots: styles.getPropertyValue('--color-accent-primary').trim() || 'oklch(0.64 0.17 42)',
    focus: styles.getPropertyValue('--color-accent-primary').trim() || 'oklch(0.64 0.17 42)',
    route: styles.getPropertyValue('--color-accent-tertiary').trim() || 'oklch(0.8 0.13 80)',
    label: styles.getPropertyValue('--color-page-foreground').trim() || 'oklch(0.258 0.03 28)',
  }
}

export default function RotatingEarth({
  width = 800,
  height = 600,
  className,
  initialRotation = [-28, -18],
  rotationSpeed = 0.35,
  scaleMultiplier = 1.08,
  instructionLabel,
  isPaused = false,
}: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isPausedRef = useRef(isPaused)

  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    let isMounted = true
    let palette = readPalette()
    let containerWidth = width
    let containerHeight = height
    let baseRadius = Math.min(containerWidth, containerHeight) / 2.5
    let fixedScale = baseRadius * scaleMultiplier
    let renderData: WorldRenderData | null = null
    let autoRotate = true
    let restartRotationTimeout = 0
    let activePointerId: number | null = null
    let dragStartX = 0
    let dragStartY = 0
    let dragStartRotation: [number, number, number] = [initialRotation[0], initialRotation[1], 0]
    const rotation: [number, number, number] = [initialRotation[0], initialRotation[1], 0]
    let velocityX = rotationSpeed
    let velocityY = 0
    let lastDragPosition: {x: number, y: number, time: number} | null = null
    let hoverX: number | null = null
    let hoverY: number | null = null

    const projection = d3.geoOrthographic().clipAngle(90)
    const path = d3.geoPath(projection, context)

    const syncCanvasSize = () => {
      containerWidth = Math.min(width, Math.max(window.innerWidth - 40, 220))
      containerHeight = Math.min(height, Math.max(window.innerHeight - 120, 180))
      baseRadius = Math.min(containerWidth, containerHeight) / 2.5
      fixedScale = baseRadius * scaleMultiplier

      const devicePixelRatio = window.devicePixelRatio || 1

      canvas.width = containerWidth * devicePixelRatio
      canvas.height = containerHeight * devicePixelRatio
      canvas.style.width = `${containerWidth}px`
      canvas.style.height = `${containerHeight}px`

      context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
      projection.scale(fixedScale).translate([containerWidth / 2, containerHeight / 2]).rotate(rotation)
    }

    const render = () => {
      const currentScale = projection.scale() ?? fixedScale
      const scaleFactor = currentScale / fixedScale
      const time = performance.now() * 0.001

      context.clearRect(0, 0, containerWidth, containerHeight)

      // Outer Atmospheric Glow
      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale + 4 * scaleFactor, 0, Math.PI * 2)
      context.fillStyle = palette.outline
      context.filter = `blur(${12 * scaleFactor}px)`
      context.globalAlpha = 0.15
      context.fill()
      context.filter = 'none'

      // Inner Globe Gradient
      const globeGradient = context.createRadialGradient(
        containerWidth / 2 - currentScale * 0.3,
        containerHeight / 2 - currentScale * 0.3,
        currentScale * 0.1,
        containerWidth / 2,
        containerHeight / 2,
        currentScale
      )
      
      // Parse color strings for color-mix compatibility (assuming oklch strings from palette)
      globeGradient.addColorStop(0, `color-mix(in srgb, ${palette.globeFill} 80%, transparent)`)
      globeGradient.addColorStop(0.7, `color-mix(in srgb, ${palette.globeFill} 50%, ${palette.outline} 15%)`)
      globeGradient.addColorStop(1, `color-mix(in srgb, ${palette.globeFill} 30%, ${palette.outline} 45%)`)

      context.beginPath()
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, Math.PI * 2)
      context.fillStyle = globeGradient
      context.globalAlpha = 0.55
      context.fill()

      context.strokeStyle = palette.outline
      context.lineWidth = 1.2 * scaleFactor
      context.globalAlpha = 0.58
      context.stroke()

      if (!renderData) {
        context.globalAlpha = 1
        return
      }

      const graticule = d3.geoGraticule()
      context.beginPath()
      path(graticule())
      context.strokeStyle = palette.graticule
      context.lineWidth = 0.8 * scaleFactor
      context.globalAlpha = 0.12
      context.stroke()

      context.beginPath()
      renderData.landFeatures.features.forEach((feature) => {
        path(feature as d3.GeoPermissibleObjects)
      })
      context.fillStyle = palette.globeFill
      context.globalAlpha = 0.1
      context.fill()
      context.strokeStyle = palette.outline
      context.lineWidth = 0.95 * scaleFactor
      context.globalAlpha = 0.32
      context.stroke()

      renderData.dots.forEach((dot) => {
        const projected = projection([dot.lng, dot.lat])

        if (!projected) {
          return
        }

        if (
          projected[0] < 0 ||
          projected[0] > containerWidth ||
          projected[1] < 0 ||
          projected[1] > containerHeight
        ) {
          return
        }

        // Calculate distance from center to fade out dots on the edge
        const dx = projected[0] - containerWidth / 2
        const dy = projected[1] - containerHeight / 2
        const distance = Math.sqrt(dx * dx + dy * dy)
        const edgeFactor = 1 - Math.pow(distance / currentScale, 3)

        let dotAlpha = Math.max(0.05, 0.56 * edgeFactor)
        let dotSize = 1.05 * scaleFactor
        let isHovered = false

        if (hoverX !== null && hoverY !== null && activePointerId === null) {
           const hoverDx = projected[0] - hoverX
           const hoverDy = projected[1] - hoverY
           const hoverDist = Math.sqrt(hoverDx * hoverDx + hoverDy * hoverDy)
           const hoverRadius = 55 * scaleFactor
           
           if (hoverDist < hoverRadius) {
             const glow = 1 - Math.pow(hoverDist / hoverRadius, 1.5)
             dotAlpha = Math.max(dotAlpha, glow * 0.95 * edgeFactor)
             dotSize += glow * 1.8 * scaleFactor
             if (glow > 0.4) isHovered = true
           }
        }

        context.globalAlpha = dotAlpha
        context.fillStyle = isHovered ? palette.focus : palette.dots

        context.beginPath()
        context.arc(projected[0], projected[1], dotSize, 0, Math.PI * 2)
        context.fill()
      })

      SERVICE_ROUTES.forEach((route, routeIndex) => {
        const fromNode = SERVICE_NODE_MAP.get(route.from)
        const toNode = SERVICE_NODE_MAP.get(route.to)

        if (!fromNode || !toNode) {
          return
        }

        const fromProjected = projection([fromNode.lng, fromNode.lat])
        const toProjected = projection([toNode.lng, toNode.lat])

        if (!fromProjected || !toProjected) {
          return
        }

        const interpolate = d3.geoInterpolate([fromNode.lng, fromNode.lat], [toNode.lng, toNode.lat])
        const routePoints: [number, number][] = []

        for (let step = 0; step <= 28; step += 1) {
          const projectedPoint = projection(interpolate(step / 28))

          if (!projectedPoint) {
            return
          }

          routePoints.push([projectedPoint[0], projectedPoint[1]])
        }

        context.beginPath()
        context.moveTo(routePoints[0][0], routePoints[0][1])

        routePoints.slice(1).forEach(([x, y]) => {
          context.lineTo(x, y)
        })

        context.strokeStyle = palette.route
        context.lineWidth = 1.1 * scaleFactor
        context.globalAlpha = 0.22
        context.stroke()

        const pulseProgress = (time * 0.035 + routeIndex * 0.18) % 1
        const pulsePoint = projection(interpolate(pulseProgress))

        if (pulsePoint) {
           // Outer glow
          context.beginPath()
          context.arc(pulsePoint[0], pulsePoint[1], 3.5 * scaleFactor, 0, Math.PI * 2)
          context.fillStyle = palette.focus
          context.filter = `blur(${3 * scaleFactor}px)`
          context.globalAlpha = 0.6
          context.fill()
          context.filter = 'none'

          // Inner core
          context.beginPath()
          context.arc(pulsePoint[0], pulsePoint[1], 1.25 * scaleFactor, 0, Math.PI * 2)
          context.fillStyle = '#fff'
          context.globalAlpha = 0.95
          context.fill()
        }
      })

      SERVICE_NODES.forEach((node) => {
        const projected = projection([node.lng, node.lat])

        if (!projected) {
          return
        }

        const markerRadius = node.role === 'base' ? 2.9 * scaleFactor : 1.8 * scaleFactor
        const pulse = node.role === 'base' ? (Math.sin(time * 1.35) + 1) * 0.22 : 0.18
        const [labelOffsetX, labelOffsetY] = node.labelOffset
        const labelX = projected[0] + labelOffsetX
        const labelY = projected[1] + labelOffsetY

        context.beginPath()
        context.arc(projected[0], projected[1], markerRadius + 2.2 * pulse * scaleFactor, 0, Math.PI * 2)
        context.strokeStyle = node.role === 'base' ? palette.route : palette.outline
        context.lineWidth = node.role === 'base' ? 1.15 * scaleFactor : 1 * scaleFactor
        context.globalAlpha = node.role === 'base' ? 0.34 : 0.14
        context.stroke()

        // Glow
        if (node.role === 'base') {
           context.beginPath()
           context.arc(projected[0], projected[1], markerRadius * 2.5, 0, Math.PI * 2)
           context.fillStyle = palette.focus
           context.filter = `blur(${5 * scaleFactor}px)`
           context.globalAlpha = 0.55
           context.fill()
           context.filter = 'none'
        }

        context.beginPath()
        context.arc(projected[0], projected[1], markerRadius, 0, Math.PI * 2)
        context.fillStyle = node.role === 'base' ? palette.focus : palette.dots
        context.globalAlpha = node.role === 'base' ? 0.96 : 0.68
        context.fill()

        if (node.role === 'base') {
          context.beginPath()
          context.arc(projected[0], projected[1], 1.1 * scaleFactor, 0, Math.PI * 2)
          context.fillStyle = palette.background
          context.globalAlpha = 0.98
          context.fill()
        }

        context.beginPath()
        context.moveTo(projected[0], projected[1])
        context.lineTo(labelX - 4, labelY)
        context.strokeStyle = node.role === 'base' ? palette.route : palette.label
        context.lineWidth = 0.8 * scaleFactor
        context.globalAlpha = node.role === 'base' ? 0.62 : 0.24
        context.stroke()

        context.font = `${node.role === 'base' ? 600 : 500} ${node.role === 'base' ? 9.5 : 8.5}px ui-sans-serif, system-ui, sans-serif`
        context.textAlign = 'left'
        context.textBaseline = 'middle'

        if (node.role === 'base') {
          context.fillStyle = palette.focus
          context.globalAlpha = 0.95
          context.fillText(node.label, labelX, labelY)
          return
        }

        context.fillStyle = palette.label
        context.globalAlpha = 0.54
        context.fillText(node.label, labelX, labelY)
      })

      context.globalAlpha = 1
    }

    const handleThemeChange = () => {
      palette = readPalette()
      render()
    }

    const stopDragging = () => {
      activePointerId = null
      
      // Inherit velocity from last movement
      if (lastDragPosition) {
         const timeDiff = performance.now() - lastDragPosition.time
         if (timeDiff > 0 && timeDiff < 100) {
           velocityX = ((dragStartX - lastDragPosition.x) / timeDiff) * 0.8
           velocityY = ((dragStartY - lastDragPosition.y) / timeDiff) * -0.8
         }
      }

      window.clearTimeout(restartRotationTimeout)
      restartRotationTimeout = window.setTimeout(() => {
        autoRotate = true
      }, 100)
    }

    const handlePointerDown = (event: PointerEvent) => {
      autoRotate = false
      activePointerId = event.pointerId
      dragStartX = event.clientX
      dragStartY = event.clientY
      lastDragPosition = { x: dragStartX, y: dragStartY, time: performance.now() }
      dragStartRotation = [...rotation] as [number, number, number]
      velocityX = 0
      velocityY = 0
      hoverX = null
      hoverY = null
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerId !== null && activePointerId !== event.pointerId) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const localX = (event.clientX - rect.left) * (containerWidth / rect.width)
      const localY = (event.clientY - rect.top) * (containerHeight / rect.height)

      if (activePointerId === event.pointerId) {
        const sensitivity = 0.42
        const deltaX = event.clientX - dragStartX
        const deltaY = event.clientY - dragStartY

        if (lastDragPosition) {
           lastDragPosition = { x: event.clientX, y: event.clientY, time: performance.now() }
        }

        rotation[0] = dragStartRotation[0] + deltaX * sensitivity
        rotation[1] = Math.max(-90, Math.min(90, dragStartRotation[1] - deltaY * sensitivity))

        projection.rotate(rotation)
      } else {
        hoverX = localX
        hoverY = localY
      }
      
      render()
    }

    const handlePointerLeave = () => {
      hoverX = null
      hoverY = null
      render()
    }

    const handlePointerUp = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) {
        return
      }
      canvas.style.cursor = 'grab'
      stopDragging()
    }

    const handleLostPointerCapture = () => {
      if (activePointerId === null) {
        return
      }

      stopDragging()
    }

    syncCanvasSize()
    render()

    const rotationTimer = d3.timer(() => {
      if (isPausedRef.current) {
         return
      }

      // Smooth decay of velocity when not dragging
      if (autoRotate) {
         velocityX = velocityX * 0.95 + rotationSpeed * 0.05
         velocityY = velocityY * 0.92
      } else {
         return // Let the pointer move handle rotation
      }

      rotation[0] += velocityX
      rotation[1] = Math.max(-90, Math.min(90, rotation[1] + velocityY))
      
      projection.rotate(rotation)
      render()
    })

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerleave', handlePointerLeave)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointercancel', handlePointerUp)
    canvas.addEventListener('lostpointercapture', handleLostPointerCapture)
    window.addEventListener('resize', syncCanvasSize)
    window.addEventListener('themechange', handleThemeChange)

    loadWorldRenderData()
      .then((data) => {
        if (!isMounted) {
          return
        }

        renderData = data
        setError(null)
        setIsLoading(false)
        render()
      })
      .catch((loadError: unknown) => {
        if (!isMounted) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'Failed to load land map data')
        setIsLoading(false)
      })

    return () => {
      isMounted = false
      rotationTimer.stop()
      window.clearTimeout(restartRotationTimeout)
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerleave', handlePointerLeave)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointercancel', handlePointerUp)
      canvas.removeEventListener('lostpointercapture', handleLostPointerCapture)
      window.removeEventListener('resize', syncCanvasSize)
      window.removeEventListener('themechange', handleThemeChange)
    }
  }, [height, initialRotation, rotationSpeed, scaleMultiplier, width])

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-[1.25rem] border border-[color-mix(in_srgb,var(--color-accent-primary)_14%,transparent)] bg-[color-mix(in_srgb,var(--color-hero-background)_78%,transparent)] p-6 text-center',
          className,
        )}
      >
        <div>
          <p className="mb-2 text-sm font-semibold text-[var(--color-accent-primary)]">
            Error loading Earth visualization
          </p>
          <p className="text-xs text-[color-mix(in_srgb,var(--color-page-foreground)_62%,transparent)]">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Container Glow Effect */}
      <div className="absolute inset-0 z-0 bg-[var(--color-accent-primary)]/5 opacity-50 blur-3xl pointer-events-none rounded-[1.25rem]" />
      
      <canvas
        ref={canvasRef}
        className="h-auto w-full touch-none rounded-[1.25rem] cursor-grab active:cursor-grabbing hover:bg-[color-mix(in_srgb,var(--color-page-background)_50%,transparent)] transition-colors bg-[color-mix(in_srgb,var(--color-page-background)_55%,transparent)]"
        style={{ maxWidth: '100%', height: 'auto', WebkitTapHighlightColor: 'transparent' }}
        aria-label="Interactive wireframe dotted globe"
      />

      {isLoading ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[1.25rem] bg-[color-mix(in_srgb,var(--color-page-background)_42%,transparent)] backdrop-blur-[2px]">
          <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--color-page-foreground)_54%,transparent)]">
            Loading land mesh
          </span>
        </div>
      ) : null}

      {instructionLabel ? (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-[color-mix(in_srgb,var(--color-accent-primary)_16%,transparent)] bg-[color-mix(in_srgb,var(--color-page-background)_72%,transparent)] px-2.5 py-1 text-[8px] font-mono uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--color-page-foreground)_54%,transparent)] backdrop-blur-sm">
          {instructionLabel}
        </div>
      ) : null}
    </div>
  )
}
