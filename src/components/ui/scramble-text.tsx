'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

const CYBER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#________'

interface ScrambleTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  hoverScrambleDuration?: number
}

export function ScrambleText({
  text,
  className = '',
  delay = 0,
  duration = 1000,
  hoverScrambleDuration = 300,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState<string>(text.replace(/./g, '\u00A0'))
  const ref = useRef<HTMLSpanElement>(null)
  const isScrambling = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  const scramble = useCallback((durationMs: number) => {
    if (isScrambling.current) return
    isScrambling.current = true
    
    const start = Date.now()
    const intervalId = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / durationMs, 1)
      
      if (progress === 1) {
        setDisplayText(text)
        isScrambling.current = false
        clearInterval(intervalId)
        return
      }
      
      const currentString = text.split('').map((char, i) => {
        if (char === ' ') return ' '
        
        // Random characters up until the char threshold is reached
        const charRevealThreshold = (i / text.length) * 0.5
        
        if (progress > charRevealThreshold) {
          const settleProgress = (progress - charRevealThreshold) / (1 - charRevealThreshold)
          if (settleProgress > 0.8 || Math.random() < settleProgress) {
            return char
          }
          return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)]
        }
        
        // Before threshold is reached, show either spaces or characters (to simulate typing out gradually)
        if (progress < charRevealThreshold - 0.3) {
            return '\u00A0'
        }
        return CYBER_CHARS[Math.floor(Math.random() * CYBER_CHARS.length)]
      }).join('')
      
      setDisplayText(currentString)
    }, 40)
    
    return () => clearInterval(intervalId)
  }, [text])

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let timeoutId: NodeJS.Timeout
    let hasAnimated = false

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          hasAnimated = true
          timeoutId = setTimeout(() => {
            scramble(duration)
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(el)

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
      clearTimeout(timeoutId)
    }
  }, [delay, duration, scramble])

  return (
    <span 
      ref={ref} 
      className={`inline-block whitespace-pre-wrap transition-all duration-200 ${className} hover:drop-shadow-[0_0_8px_color-mix(in_srgb,var(--color-accent-primary)_50%,transparent)]`}
      onMouseEnter={() => {
        if (!isScrambling.current) {
            scramble(hoverScrambleDuration)
        }
      }}
    >
      {displayText}
    </span>
  )
}
