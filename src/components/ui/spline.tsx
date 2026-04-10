'use client'

import { Suspense, lazy, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { useBootReady } from '@/lib/use-boot-ready'

const Spline = lazy(() => import('@splinetool/react-spline'))

type SplineSceneProps = {
  scene: string
  className?: string
}

function SplineFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rounded-full border border-[color-mix(in_srgb,var(--color-accent-primary)_22%,transparent)]" />
        <div className="absolute inset-[16%] rounded-full border border-[color-mix(in_srgb,var(--color-accent-primary)_42%,transparent)] animate-pulse" />
        <div className="absolute inset-[34%] rounded-full bg-[color-mix(in_srgb,var(--color-accent-primary)_16%,transparent)] blur-md" />
      </div>
    </div>
  )
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const bootReady = useBootReady()
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    if (!bootReady || shouldLoad) {
      return
    }

    const element = containerRef.current

    if (!element) {
      return
    }

    const activate = () => {
      if (element.getClientRects().length === 0) {
        return
      }

      setShouldLoad(true)
    }

    activate()

    if (shouldLoad) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return
        }

        activate()
      },
      { rootMargin: '240px 0px' },
    )

    observer.observe(element)
    window.addEventListener('resize', activate)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', activate)
    }
  }, [bootReady, shouldLoad])

  return (
    <div ref={containerRef} className={cn('h-full w-full', className)}>
      {shouldLoad ? (
        <Suspense fallback={<SplineFallback />}>
          <Spline scene={scene} className="h-full w-full" />
        </Suspense>
      ) : (
        <SplineFallback />
      )}
    </div>
  )
}
