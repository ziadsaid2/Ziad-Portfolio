'use client'

import * as motion from 'motion/react-client'
import { useEffect, useRef } from 'react'

export function AboutBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current || !scannerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        const mask = `radial-gradient(circle 400px at ${x}% ${y}%, black 0%, transparent 100%)`
        scannerRef.current.style.maskImage = mask
        scannerRef.current.style.webkitMaskImage = mask
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[var(--color-page-background)]"
    >
      {/* ───── LAYER 1: BIOMETRIC CROSS-HAIR MATRIX ───── */}
      <div 
        className="absolute inset-0 opacity-[0.14] dark:opacity-[0.06]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--color-accent-primary) 1.5px, transparent 0),
            linear-gradient(to right, var(--color-accent-primary) 0.5px, transparent 0.5px),
            linear-gradient(to bottom, var(--color-accent-primary) 0.5px, transparent 0.5px)
          `,
          backgroundSize: '80px 80px, 80px 80px, 80px 80px',
          backgroundPosition: 'center center'
        }}
      />

      {/* ───── LAYER 2: TOPOGRAPHIC TOPOLOGY (JOURNEY LINES) ───── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.04]">
        <defs>
          <filter id="liquid">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="35" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter="url(#liquid)">
          {Array.from({ length: 8 }).map((_, i) => (
            <ellipse
              key={i}
              cx="50%"
              cy="50%"
              rx={`${20 + i * 15}%`}
              ry={`${15 + i * 12}%`}
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="0.5"
              className="opacity-40"
            />
          ))}
        </g>
      </svg>

      {/* ───── LAYER 3: INTERACTIVE BIOMETRIC SCANNER ───── */}
      <div
        ref={scannerRef}
        className="absolute inset-0 z-10 opacity-[0.15] dark:opacity-[0.08]"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')`,
          maskImage: `radial-gradient(circle 400px at 50% 50%, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 400px at 50% 50%, black 0%, transparent 100%)`,
        }}
      />

      {/* ───── LAYER 4: IDENTITY DATA MARKERS ───── */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20">
         {/* Identity Stamp (Right) */}
         <div className="absolute right-12 top-24 flex flex-col items-end gap-2 rotate-90 origin-right">
            <div className="flex items-center gap-4">
               <div className="h-px w-24 bg-[var(--color-accent-primary)]" />
               <span className="font-mono text-[9px] font-black uppercase tracking-[0.5em] text-[var(--color-accent-primary)]">Verified_Entity // ZS94</span>
            </div>
            <span className="font-mono text-[7px] opacity-60">LOC_SCAN: Alexandria, Egy // Lat: 31.2 // Lon: 29.9</span>
         </div>
      </div>

      {/* ───── LAYER 5: DATA MESH (CONNECTIVITY) ───── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.1] dark:opacity-[0.06]">
        <line x1="15%" y1="12%" x2="35%" y2="42%" stroke="var(--color-accent-primary)" strokeWidth="0.8" strokeDasharray="6 4" />
        <line x1="85%" y1="18%" x2="65%" y2="52%" stroke="var(--color-accent-primary)" strokeWidth="0.8" strokeDasharray="6 4" />
        <line x1="25%" y1="75%" x2="10%" y2="40%" stroke="var(--color-accent-primary)" strokeWidth="0.8" strokeDasharray="6 4" />
        <circle cx="35%" cy="42%" r="3" fill="var(--color-accent-primary)" className="animate-pulse" />
        <circle cx="65%" cy="52%" r="3" fill="var(--color-accent-primary)" className="animate-pulse" />
        <circle cx="10%" cy="40%" r="3" fill="var(--color-accent-primary)" className="animate-pulse" />
      </svg>

      {/* ───── LAYER 6: BIOMETRIC SIDEBARS (LEFT & RIGHT) ───── */}
      {/* Left: Vertical Measurement Scale (Ruler) */}
      <div className="absolute left-10 top-20 bottom-20 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-accent-primary)] to-transparent opacity-60">
        {Array.from({ length: 25 }).map((_, i) => (
          <div 
            key={i} 
            className="absolute left-0 h-[1px] bg-[var(--color-accent-primary)] transition-all duration-700" 
            style={{ 
              top: `${(i / 25) * 100}%`,
              width: i % 5 === 0 ? '12px' : '4px' 
            }}
          >
            {i % 5 === 0 && (
              <span className="absolute left-4 -top-1 font-mono text-[7px] font-black uppercase tracking-widest text-[var(--color-accent-primary)]">
                {1000 - (i * 40)}ms
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Right: Perpetual HUD Arc */}
      <div className="absolute right-[-150px] top-1/2 -translate-y-1/2 w-[300px] h-[600px] opacity-[0.12] dark:opacity-[0.06] pointer-events-none">
         <svg viewBox="0 0 100 200" className="w-full h-full animate-[spin_40s_linear_infinite]">
            <path d="M 100 10 A 90 90 0 0 0 100 190" fill="none" stroke="var(--color-accent-primary)" strokeWidth="0.5" strokeDasharray="5 5" />
            <path d="M 100 30 A 70 70 0 0 0 100 170" fill="none" stroke="var(--color-accent-primary)" strokeWidth="0.8" />
            <circle cx="30" cy="100" r="4" fill="var(--color-accent-primary)" />
         </svg>
      </div>

      {/* Far Right: Measurement Blocks */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col gap-8 opacity-40">
         {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
               <div className="h-3 w-1 bg-[var(--color-accent-primary)]" />
               <div className="h-[1px] w-8 bg-[var(--color-accent-primary)]/40" />
               <span className="font-mono text-[8px] tracking-widest text-[var(--color-accent-primary)]">BIO_A_{i+1}</span>
            </div>
         ))}
      </div>

      {/* ───── LAYER 7: MILESTONE TIMEMARKS ───── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-[0.2]">
        <div className="absolute top-[15%] left-[20%] flex flex-col items-center">
            <div className="w-[1.5px] h-6 bg-[var(--color-accent-primary)] mb-1.5" />
            <span className="font-mono text-[7px] font-black uppercase tracking-widest text-[var(--color-accent-primary)]">2018_START</span>
        </div>
        <div className="absolute top-[28%] left-[38%] flex flex-col items-center">
            <div className="w-[1px] h-4 bg-[var(--color-accent-primary)] mb-1" />
            <span className="font-mono text-[7px] font-black uppercase tracking-widest text-[var(--color-accent-primary)]">2021_INIT</span>
        </div>
        <div className="absolute top-[60%] right-[40%] flex flex-col items-center">
            <div className="w-[1.5px] h-6 bg-[var(--color-accent-primary)] mb-1.5" />
            <span className="font-mono text-[7px] font-black uppercase tracking-widest text-[var(--color-accent-primary)]">2022_EVOLVE</span>
        </div>
        <div className="absolute bottom-[30%] right-[18%] flex flex-col items-center">
            <div className="w-[1.5px] h-8 bg-[var(--color-accent-primary)] mb-1.5" />
            <span className="font-mono text-[7px] font-black uppercase tracking-widest text-[var(--color-accent-primary)]">2024_DEPLOY</span>
        </div>
      </div>

      {/* ───── LAYER 8: REINFORCED CORNER HUD ───── */}
      <div className="absolute top-12 left-12 p-3 border-l-2 border-t-2 border-[var(--color-accent-primary)]/20 opacity-50 flex flex-col gap-1">
          <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[var(--color-accent-primary)]">[SEC_03]</span>
          <span className="font-mono text-[6px] opacity-60">AUTH: VERIFIED</span>
      </div>

      {/* ───── LAYER 9: DUAL ROTATING WIREFRAMES ───── */}
      <div className="absolute bottom-16 left-12 w-20 h-20 opacity-[0.14] dark:opacity-[0.08]">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_25s_linear_infinite]">
          <path d="M 50 10 L 90 30 L 90 70 L 50 90 L 10 70 L 10 30 Z" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" />
          <path d="M 50 10 L 50 90 M 90 30 L 10 70 M 90 70 L 10 30" stroke="var(--color-accent-primary)" strokeWidth="0.8" opacity="0.5" />
        </svg>
      </div>

      <div className="absolute top-16 right-40 w-14 h-14 opacity-[0.1] dark:opacity-[0.06]">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_15s_linear_infinite_reverse]">
          <path d="M 50 10 L 90 50 L 50 90 L 10 50 Z" fill="none" stroke="var(--color-accent-primary)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ───── LAYER 10: GRAIN & BLENDING ───── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
      
      {/* FINAL SECTION MASKS */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-page-background)_100%)] opacity-30" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[var(--color-page-background)] to-transparent z-10" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--color-page-background)] to-transparent z-10" />
    </div>
  )
}
