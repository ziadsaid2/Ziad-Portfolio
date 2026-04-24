'use client'

import dynamic from 'next/dynamic'

const FloatingProgressIndicator = dynamic(() => import('@/components/floating-progress-indicator'), {
  ssr: false,
})

export default function ClientLayoutEffects() {
  return (
    <>
      <FloatingProgressIndicator />
    </>
  )
}
