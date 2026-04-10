'use client'

import { Suspense, lazy } from 'react'

import { cn } from '@/lib/utils'

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
  return (
    <Suspense fallback={<SplineFallback />}>
      <Spline scene={scene} className={cn('h-full w-full', className)} />
    </Suspense>
  )
}
