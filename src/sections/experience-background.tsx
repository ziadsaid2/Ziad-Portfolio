'use client'

import * as motion from 'motion/react-client'
import { useEffect, useState, useRef, useMemo } from 'react'

export function ExperienceBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const telemetryData = useMemo(() => {
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      sys: `SYS_${(i % 99).toString().padStart(2, '0')}`,
      hex: `0x${((i * 73 + 64) % 256).toString(16).toUpperCase().padStart(2, '0')}`,
      val: ((((i * 7919) % 100000) / 1000) % 100).toFixed(4),
      volt: `+${(i % 24)}V`
    }))
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
    >
      {/* 1. LAYER: Base Slate */}
      <div className="absolute inset-0 bg-[var(--color-page-background)]" />
      
      {/* 2. LAYER: Main Structural Grid with Depth */}
      <div 
        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb, var(--color-accent-primary) 15%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--color-accent-primary) 15%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />
      <div 
        className="absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage: `
            linear-gradient(to right, color-mix(in srgb, var(--color-accent-primary) 30%, transparent) 1px, transparent 1px),
            linear-gradient(to bottom, color-mix(in srgb, var(--color-accent-primary) 30%, transparent) 1px, transparent 1px)
          `,
          backgroundSize: '20rem 20rem',
        }}
      />

      {/* 3. LAYER: Interactive Laser Follower */}
      <div 
        className="absolute inset-0 opacity-20 dark:opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle 400px at ${mousePos.x}% ${mousePos.y}%, color-mix(in srgb, var(--color-accent-primary) 15%, transparent), transparent 80%)`
        }}
      />

      {/* 4. LAYER: HUD Telemetry Sidebars */}
      <div className="absolute left-6 top-0 bottom-0 w-28 hidden lg:flex flex-col gap-2 py-20 opacity-100 dark:opacity-[0.15] overflow-hidden">
        <motion.div 
          animate={{ y: ["0%", "-50%"] }} 
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex flex-col gap-2"
        >
          {[...telemetryData, ...telemetryData].map((d, idx) => (
            <div key={`${d.id}-${idx}`} className="font-mono text-[11px] font-bold dark:font-normal tracking-wide flex justify-between shrink-0 group/tele">
              <span className="text-[var(--color-accent-primary)] group-hover:underline decoration-[1px]">{d.sys}</span>
              <span className="text-[var(--color-page-foreground)] opacity-100 dark:opacity-40">{d.hex}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute right-6 top-0 bottom-0 w-28 hidden lg:flex flex-col gap-2 py-20 opacity-100 dark:opacity-[0.15] overflow-hidden">
        <motion.div 
          animate={{ y: ["-50%", "0%"] }} 
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="flex flex-col gap-1.5"
        >
          {[...telemetryData, ...telemetryData].map((d, idx) => (
            <div key={`${d.id}-${idx}`} className="font-mono text-[11px] font-bold dark:font-normal tracking-wide flex justify-between shrink-0">
               <span className="text-[var(--color-page-foreground)] opacity-100 dark:opacity-40">{d.val}</span>
               <span className="text-[var(--color-accent-primary)] font-bold">{d.volt}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 5. LAYER: Vertical Watermark Text (Left Side) */}
      <div className="absolute left-6 lg:left-[12rem] top-0 bottom-0 w-[200px] hidden lg:flex items-center justify-center opacity-[0.8] dark:opacity-[0.03] pointer-events-none select-none overflow-hidden">
        <span className="text-[12rem] font-bold tracking-tighter uppercase whitespace-nowrap -rotate-90 select-none text-[var(--color-accent-primary)]">
          Experience
        </span>
      </div>

      {/* 6. LAYER: SVG Blueprint Elements */}
      <svg className="absolute inset-0 w-full h-full opacity-[1.0] dark:opacity-[0.3]">
        <defs>
          <linearGradient id="laser-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--color-accent-primary)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          
          <pattern id="dot-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="var(--color-accent-primary)" opacity="0.4" />
          </pattern>
        </defs>

        {/* Large Blueprint Circle */}
        <circle 
          cx="15%" 
          cy="30%" 
          r="150" 
          fill="none" 
          stroke="var(--color-accent-primary)" 
          strokeWidth="0.5" 
          strokeDasharray="10 5" 
          className="opacity-40"
        />
        <circle 
          cx="15%" 
          cy="30%" 
          r="140" 
          fill="none" 
          stroke="var(--color-accent-primary)" 
          strokeWidth="0.3" 
          className="opacity-20"
        />

        {/* Diagonal Industrial Lines */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="var(--color-accent-primary)" strokeWidth="0.5" strokeDasharray="100 200" className="opacity-10" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="var(--color-accent-primary)" strokeWidth="0.5" strokeDasharray="100 200" className="opacity-10" />

        {/* Animated Horizontal Scanbeams */}
        <motion.rect
          width="100%"
          height="1"
          fill="url(#laser-grad)"
          initial={{ y: "-10%" }}
          animate={{ y: "110%" }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.rect
          width="100%"
          height="1"
          fill="url(#laser-grad)"
          initial={{ y: "-10%" }}
          animate={{ y: "110%" }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
          className="opacity-50"
        />
      </svg>

      {/* 6. LAYER: Repeating Vertical Scale */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-[5%] top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-accent-primary)] to-transparent opacity-10 hidden lg:block">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="absolute right-0 h-[1px] bg-[var(--color-accent-primary)] opacity-40 transition-all duration-700"
              style={{ 
                top: `${(i / 40) * 100}%`,
                width: i % 5 === 0 ? '12px' : '4px' 
              }}
            />
          ))}
        </div>
      </div>

      {/* 7. LAYER: FINAL GRADIENT MASKS */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-page-background)] to-transparent" />
      
      {/* Vignette - Adds cinematic depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--color-page-background)_100%)] opacity-20 pointer-events-none" />

      {/* Main content mask to ensure readability */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_100%)] z-10" />
    </div>
  )
}
