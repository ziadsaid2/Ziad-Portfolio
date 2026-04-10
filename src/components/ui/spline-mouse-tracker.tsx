'use client'

import { useRef, useEffect, useCallback, type ReactNode } from 'react'

interface SplineMouseTrackerProps {
  children: ReactNode
  className?: string
}

/**
 * Captures pointer-move events across the entire wrapper (Skills section)
 * and relays them to the Spline canvas so the robot tracks the cursor
 * everywhere in the section — not just inside its own box.
 *
 * How it works:
 *  - The Spline runtime listens for pointermove / mousemove on its canvas.
 *  - We intercept moves on the section-wide wrapper and dispatch synthetic
 *    events on the canvas with the real clientX / clientY / pageX / pageY.
 *  - The runtime internally computes  pageX − canvasRect.left  to get the
 *    relative offset, so the robot will look *toward* the mouse naturally.
 *  - When the mouse is directly over the canvas, native events already fire
 *    so we skip the synthetic dispatch to avoid doubling.
 */
export function SplineMouseTracker({
  children,
  className,
}: SplineMouseTrackerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  // Cache the canvas reference so we don't querySelector every frame
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const interactiveRef = useRef<HTMLElement | null>(null)

  // Resolve canvas lazily (Spline loads async)
  const getCanvas = useCallback(() => {
    if (canvasRef.current) return canvasRef.current
    const wrapper = wrapperRef.current
    if (!wrapper) return null
    const canvas = wrapper.querySelector<HTMLCanvasElement>(
      '[data-cursor="interactive"] canvas'
    )
    if (canvas) {
      canvasRef.current = canvas
      interactiveRef.current = wrapper.querySelector<HTMLElement>(
        '[data-cursor="interactive"]'
      )
    }
    return canvas
  }, [])

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const onPointerMove = (e: PointerEvent) => {
      const canvas = getCanvas()
      if (!canvas) return

      // If the pointer is already over the interactive region the native
      // event is enough — skip to avoid double-processing.
      const interactive = interactiveRef.current
      if (interactive && interactive.contains(e.target as Node)) return

      // Dispatch both pointermove and mousemove — different Spline
      // subsystems listen on different event types.
      const shared = {
        view: window,         // CRITICAL: makes pageX/pageY include scroll offset
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        movementX: e.movementX,
        movementY: e.movementY,
        bubbles: false,       // don't re-bubble back to the wrapper
        cancelable: true,
      }

      canvas.dispatchEvent(
        new PointerEvent('pointermove', {
          ...shared,
          pointerId: e.pointerId,
          pointerType: e.pointerType,
        })
      )
      canvas.dispatchEvent(new MouseEvent('mousemove', shared))
    }

    wrapper.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => wrapper.removeEventListener('pointermove', onPointerMove)
  }, [getCanvas])

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  )
}
