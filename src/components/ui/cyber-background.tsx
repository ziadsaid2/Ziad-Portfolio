'use client'

import { useMemo } from 'react'
import * as motion from 'motion/react-client'

const deterministicValue = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function CyberBackground() {
  const beams = useMemo(
    () => Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: Math.floor(deterministicValue(i + 1) * 100),
      duration: 10 + deterministicValue(i + 21) * 15,
      delay: deterministicValue(i + 41) * 5,
      direction: deterministicValue(i + 61) > 0.5 ? 1 : -1,
      opacity: 0.5 + deterministicValue(i + 81) * 0.5,
    })),
    []
  )

  const nodes = useMemo(
    () => Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: 15 + Math.floor(deterministicValue(i + 101) * 70),
      left: 10 + Math.floor(deterministicValue(i + 121) * 80),
      delay: deterministicValue(i + 141) * 3,
    })),
    []
  )

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--color-accent-primary)] opacity-40 dark:opacity-10 blur-[120px] mix-blend-normal" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--color-accent-tertiary,var(--color-accent-primary))] opacity-40 dark:opacity-10 blur-[100px] mix-blend-normal" />

      {/* --- AMAZING ORBITAL RADAR EFFECT --- */}
      <div className="absolute right-[-20%] top-[-10%] opacity-80 dark:opacity-30">
        {/* Outer dotted ring */}
        <motion.div 
          className="absolute w-[1200px] h-[1200px] -ml-[600px] -mt-[600px] rounded-full border-[2.5px] dark:border-[2px] border-[var(--color-accent-primary)]"
          style={{ borderStyle: 'dotted' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        />
        {/* Middle dashed ring */}
        <motion.div 
          className="absolute w-[900px] h-[900px] -ml-[450px] -mt-[450px] rounded-full border border-[var(--color-accent-primary)]"
          style={{ 
            borderStyle: 'dashed',
            borderWidth: '1px',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
            maskImage: 'linear-gradient(to bottom, black, transparent)'
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        {/* Radar radar sweep */}
        <motion.div 
          className="absolute w-[900px] h-[900px] -ml-[450px] -mt-[450px] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 70%, color-mix(in srgb, var(--color-accent-primary) 35%, transparent) 100%)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        {/* Crosshair logic */}
        <div className="absolute w-[1000px] h-[1px] bg-[var(--color-accent-primary)] opacity-40 dark:opacity-30 -ml-[500px]" />
        <div className="absolute w-[1px] h-[1000px] bg-[var(--color-accent-primary)] opacity-40 dark:opacity-30 -mt-[500px]" />
      </div>

      {/* --- TELEMETRY FLAT GRID & NODES --- */}
      {/* Flat architectural micro-grid that stays still and elegant */}
      <div className="absolute inset-0 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-accent-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-accent-primary) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 90%)'
        }}
      />

      {/* Floating Blueprint Nodes */}
      {nodes.map(node => (
        <motion.div
           key={`node-${node.id}`}
           className="absolute w-16 h-16 border border-[var(--color-accent-primary)] opacity-70 dark:opacity-30"
           style={{ top: `${node.top}%`, left: `${node.left}%` }}
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ 
             opacity: [0, 0.6, 0.2, 0.7, 0], 
             scale: [0.9, 1, 0.98, 1, 0.9] 
           }}
           transition={{ duration: 6, repeat: Infinity, delay: node.delay }}
        >
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 dark:border-t border-l-2 dark:border-l border-[var(--color-accent-primary)]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 dark:border-t border-r-2 dark:border-r border-[var(--color-accent-primary)]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 dark:border-b border-l-2 dark:border-l border-[var(--color-accent-primary)]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 dark:border-b border-r-2 dark:border-r border-[var(--color-accent-primary)]" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--color-accent-primary)] animate-pulse" />
        </motion.div>
      ))}

      {/* --- MOVING DATA BEAMS --- */}
      <div className="absolute inset-0">
        {beams.map((beam) => (
          <motion.div
            key={`beam-${beam.id}`}
            className="absolute h-[1px] w-[300px]"
            style={{
              top: `${beam.top}%`,
              background: `linear-gradient(to right, transparent, var(--color-accent-primary), transparent)`,
              opacity: beam.opacity,
            }}
            initial={{ left: beam.direction === 1 ? '-300px' : '100%' }}
            animate={{ left: beam.direction === 1 ? '100%' : '-300px' }}
            transition={{
              duration: beam.duration,
              repeat: Infinity,
              ease: "linear",
              delay: beam.delay,
            }}
          />
        ))}
      </div>

      {/* Vertical Global Scanline sweep */}
      <motion.div 
        className="absolute inset-0 w-full h-[2px] bg-[var(--color-accent-primary)] opacity-100 dark:opacity-20 blur-[1px]"
        initial={{ top: '-10%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div 
        className="absolute inset-0 w-full h-[20vh] bg-gradient-to-b from-transparent via-[var(--color-accent-primary)] to-transparent opacity-15 dark:opacity-10 blur-[20px]"
        initial={{ top: '-30%' }}
        animate={{ top: '110%' }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* --- TELEMETRY DATA TEXT --- */}
      <div className="absolute top-[15%] left-[5%] text-[9px] font-mono font-bold dark:font-normal text-[var(--color-accent-primary)] opacity-100 dark:opacity-60 space-y-1">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.5] }} transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}>SYS.TRK: ONLINE</motion.p>
        <p>ORBIT_V: 89.22<span className="animate-pulse">_</span></p>
        <p>SEC_AUTH: VERIFIED</p>
      </div>

      {/* Top and Bottom soft gradients to ensure blending with adjacent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-page-background)] via-transparent via-20% to-80% to-[var(--color-page-background)]" />
    </div>
  )
}
