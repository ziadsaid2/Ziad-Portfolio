'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'

import { cn } from '@/lib/utils'

type GlobeConnection = {
  from: [number, number]
  to: [number, number]
}

type GlobeMarker = {
  lat: number
  lng: number
  label?: string
}

interface InteractiveGlobeProps {
  className?: string
  size?: number
  dotColor?: string
  arcColor?: string
  markerColor?: string
  autoRotateSpeed?: number
  connections?: GlobeConnection[]
  markers?: GlobeMarker[]
}

const DEFAULT_MARKERS: GlobeMarker[] = [
  { lat: 31.2, lng: 29.92, label: 'Alexandria' },
  { lat: 51.51, lng: -0.13, label: 'London' },
  { lat: 25.2, lng: 55.27, label: 'Dubai' },
  { lat: 1.35, lng: 103.82, label: 'Singapore' },
  { lat: 37.78, lng: -122.42, label: 'San Francisco' },
]

const DEFAULT_CONNECTIONS: GlobeConnection[] = [
  { from: [31.2, 29.92], to: [51.51, -0.13] },
  { from: [31.2, 29.92], to: [25.2, 55.27] },
  { from: [31.2, 29.92], to: [1.35, 103.82] },
  { from: [31.2, 29.92], to: [37.78, -122.42] },
  { from: [51.51, -0.13], to: [37.78, -122.42] },
]

function latLngToXYZ(lat: number, lng: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180

  return [
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

function rotateY(x: number, y: number, z: number, angle: number): [number, number, number] {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return [x * cos + z * sin, y, -x * sin + z * cos]
}

function rotateX(x: number, y: number, z: number, angle: number): [number, number, number] {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)

  return [x, y * cos - z * sin, y * sin + z * cos]
}

function project(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  fieldOfView: number,
): [number, number, number] {
  const scale = fieldOfView / (fieldOfView + z)

  return [x * scale + centerX, y * scale + centerY, z]
}

export default function InteractiveGlobe({
  className,
  size = 320,
  dotColor = 'rgba(255, 110, 47, ALPHA)',
  arcColor = 'rgba(255, 110, 47, 0.35)',
  markerColor = 'rgba(255, 126, 71, 1)',
  autoRotateSpeed = 0.002,
  connections = DEFAULT_CONNECTIONS,
  markers = DEFAULT_MARKERS,
}: InteractiveGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotYRef = useRef(0.35)
  const rotXRef = useRef(0.25)
  const animRef = useRef<number>(0)
  const timeRef = useRef(0)
  const dotsRef = useRef<[number, number, number][]>([])
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const dragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startRotY: 0,
    startRotX: 0,
  })

  useEffect(() => {
    const dots: [number, number, number][] = []
    const numDots = 1200
    const goldenRatio = (1 + Math.sqrt(5)) / 2

    for (let index = 0; index < numDots; index += 1) {
      const theta = (2 * Math.PI * index) / goldenRatio
      const phi = Math.acos(1 - (2 * (index + 0.5)) / numDots)
      const x = Math.cos(theta) * Math.sin(phi)
      const y = Math.cos(phi)
      const z = Math.sin(theta) * Math.sin(phi)
      dots.push([x, y, z])
    }

    dotsRef.current = dots
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncPreference)
    }
  }, [])

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    const devicePixelRatio = window.devicePixelRatio || 1
    const width = canvas.clientWidth
    const height = canvas.clientHeight

    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.38
    const fieldOfView = 600

    if (!dragRef.current.active && !prefersReducedMotion) {
      rotYRef.current += autoRotateSpeed
    }

    timeRef.current += prefersReducedMotion ? 0 : 0.015
    const time = timeRef.current

    context.clearRect(0, 0, width, height)

    const glowGradient = context.createRadialGradient(
      centerX,
      centerY,
      radius * 0.8,
      centerX,
      centerY,
      radius * 1.45,
    )
    glowGradient.addColorStop(0, 'rgba(255, 110, 47, 0.08)')
    glowGradient.addColorStop(1, 'rgba(255, 110, 47, 0)')
    context.fillStyle = glowGradient
    context.fillRect(0, 0, width, height)

    context.beginPath()
    context.arc(centerX, centerY, radius, 0, Math.PI * 2)
    context.strokeStyle = 'rgba(255, 126, 71, 0.12)'
    context.lineWidth = 1
    context.stroke()

    const rotationY = rotYRef.current
    const rotationX = rotXRef.current

    for (const dot of dotsRef.current) {
      let [x, y, z] = dot
      x *= radius
      y *= radius
      z *= radius

      ;[x, y, z] = rotateX(x, y, z, rotationX)
      ;[x, y, z] = rotateY(x, y, z, rotationY)

      if (z > 0) {
        continue
      }

      const [screenX, screenY] = project(x, y, z, centerX, centerY, fieldOfView)
      const depthAlpha = Math.max(0.1, 1 - (z + radius) / (2 * radius))
      const dotSize = 1 + depthAlpha * 0.8

      context.beginPath()
      context.arc(screenX, screenY, dotSize, 0, Math.PI * 2)
      context.fillStyle = dotColor.replace('ALPHA', depthAlpha.toFixed(2))
      context.fill()
    }

    for (const connection of connections) {
      const [lat1, lng1] = connection.from
      const [lat2, lng2] = connection.to

      let [x1, y1, z1] = latLngToXYZ(lat1, lng1, radius)
      let [x2, y2, z2] = latLngToXYZ(lat2, lng2, radius)

      ;[x1, y1, z1] = rotateX(x1, y1, z1, rotationX)
      ;[x1, y1, z1] = rotateY(x1, y1, z1, rotationY)
      ;[x2, y2, z2] = rotateX(x2, y2, z2, rotationX)
      ;[x2, y2, z2] = rotateY(x2, y2, z2, rotationY)

      if (z1 > radius * 0.3 && z2 > radius * 0.3) {
        continue
      }

      const [startX, startY] = project(x1, y1, z1, centerX, centerY, fieldOfView)
      const [endX, endY] = project(x2, y2, z2, centerX, centerY, fieldOfView)
      const midX = (x1 + x2) / 2
      const midY = (y1 + y2) / 2
      const midZ = (z1 + z2) / 2
      const midLength = Math.sqrt(midX * midX + midY * midY + midZ * midZ)
      const arcHeight = radius * 1.2
      const elevatedX = (midX / midLength) * arcHeight
      const elevatedY = (midY / midLength) * arcHeight
      const elevatedZ = (midZ / midLength) * arcHeight
      const [controlX, controlY] = project(elevatedX, elevatedY, elevatedZ, centerX, centerY, fieldOfView)

      context.beginPath()
      context.moveTo(startX, startY)
      context.quadraticCurveTo(controlX, controlY, endX, endY)
      context.strokeStyle = arcColor
      context.lineWidth = 1.2
      context.stroke()

      if (!prefersReducedMotion) {
        const progress = (Math.sin(time * 1.15 + lat1 * 0.1) + 1) / 2
        const travelX =
          (1 - progress) * (1 - progress) * startX +
          2 * (1 - progress) * progress * controlX +
          progress * progress * endX
        const travelY =
          (1 - progress) * (1 - progress) * startY +
          2 * (1 - progress) * progress * controlY +
          progress * progress * endY

        context.beginPath()
        context.arc(travelX, travelY, 2, 0, Math.PI * 2)
        context.fillStyle = markerColor
        context.fill()
      }
    }

    for (const marker of markers) {
      let [x, y, z] = latLngToXYZ(marker.lat, marker.lng, radius)
      ;[x, y, z] = rotateX(x, y, z, rotationX)
      ;[x, y, z] = rotateY(x, y, z, rotationY)

      if (z > radius * 0.1) {
        continue
      }

      const [screenX, screenY] = project(x, y, z, centerX, centerY, fieldOfView)
      const pulse = prefersReducedMotion ? 0.35 : Math.sin(time * 2 + marker.lat) * 0.5 + 0.5

      context.beginPath()
      context.arc(screenX, screenY, 4 + pulse * 4, 0, Math.PI * 2)
      context.strokeStyle = markerColor.replace('1)', `${0.2 + pulse * 0.15})`)
      context.lineWidth = 1
      context.stroke()

      context.beginPath()
      context.arc(screenX, screenY, 2.5, 0, Math.PI * 2)
      context.fillStyle = markerColor
      context.fill()

      if (marker.label) {
        context.font = '10px system-ui, sans-serif'
        context.fillStyle = markerColor.replace('1)', '0.58)')
        context.fillText(marker.label, screenX + 8, screenY + 3)
      }
    }

  }, [arcColor, autoRotateSpeed, connections, dotColor, markerColor, markers, prefersReducedMotion])

  useEffect(() => {
    const render = () => {
      drawFrame()
      animRef.current = window.requestAnimationFrame(render)
    }

    animRef.current = window.requestAnimationFrame(render)

    return () => {
      window.cancelAnimationFrame(animRef.current)
    }
  }, [drawFrame])

  const onPointerDown = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      startRotY: rotYRef.current,
      startRotX: rotXRef.current,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const onPointerMove = useCallback((event: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current.active) {
      return
    }

    const deltaX = event.clientX - dragRef.current.startX
    const deltaY = event.clientY - dragRef.current.startY
    rotYRef.current = dragRef.current.startRotY + deltaX * 0.005
    rotXRef.current = Math.max(-1, Math.min(1, dragRef.current.startRotX + deltaY * 0.005))
  }, [])

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('h-full w-full cursor-grab active:cursor-grabbing', className)}
      style={{ width: size, height: size, maxWidth: '100%', maxHeight: '100%' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-label="Interactive remote availability globe with Turkey-focused overlap"
    />
  )
}
