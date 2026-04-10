'use client'

import { useEffect, useState } from 'react'

export const BOOT_READY_EVENT = 'boot:ready'
const BOOT_READY_ATTRIBUTE = 'data-boot-ready'

const isBootReady = () => document.documentElement.getAttribute(BOOT_READY_ATTRIBUTE) === 'true'

export function markBootReady() {
  document.documentElement.setAttribute(BOOT_READY_ATTRIBUTE, 'true')
  window.dispatchEvent(new Event(BOOT_READY_EVENT))
}

export function useBootReady() {
  const [bootReady, setBootReady] = useState(false)

  useEffect(() => {
    if (isBootReady()) {
      setBootReady(true)
      return
    }

    const handleBootReady = () => setBootReady(true)

    window.addEventListener(BOOT_READY_EVENT, handleBootReady)

    return () => {
      window.removeEventListener(BOOT_READY_EVENT, handleBootReady)
    }
  }, [])

  return bootReady
}
