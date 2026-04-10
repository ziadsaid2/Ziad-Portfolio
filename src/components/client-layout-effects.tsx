'use client'

import dynamic from 'next/dynamic'

const SmoothFollower = dynamic(() => import('@/components/smooth-follower'), {
  ssr: false,
})

const FloatingProgressIndicator = dynamic(() => import('@/components/floating-progress-indicator'), {
  ssr: false,
})

export default function ClientLayoutEffects() {
  return (
    <>
      <SmoothFollower />
      <FloatingProgressIndicator />
    </>
  )
}
