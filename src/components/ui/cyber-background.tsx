'use client'

import { useMemo } from 'react'

const deterministicValue = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

export function CyberBackground() {
  const beams = useMemo(
    () => Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      top: Math.floor(deterministicValue(i + 1) * 100),
      left: Math.floor(deterministicValue(i + 201) * 100),
      opacity: 0.5 + deterministicValue(i + 81) * 0.5,
    })),
    []
  )

  const nodes = useMemo(
    () => Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: 15 + Math.floor(deterministicValue(i + 101) * 70),
      left: 10 + Math.floor(deterministicValue(i + 121) * 80),
      opacity: 0.4 + deterministicValue(i + 141) * 0.3,
    })),
    []
  )

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-[var(--color-accent-primary)] opacity-40 dark:opacity-10 blur-[120px] mix-blend-normal" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full bg-[var(--color-accent-tertiary,var(--color-accent-primary))] opacity-40 dark:opacity-10 blur-[100px] mix-blend-normal" />

      {/* --- ORBITAL RADAR (static) --- */}
      <div className="absolute right-[-20%] top-[-10%] opacity-80 dark:opacity-30">
        {/* Outer dotted ring */}
        <div
          className="absolute w-[1200px] h-[1200px] -ml-[600px] -mt-[600px] rounded-full border-[2.5px] dark:border-[2px] border-[var(--color-accent-primary)]"
          style={{ borderStyle: 'dotted' }}
        />
        {/* Middle dashed ring */}
        <div
          className="absolute w-[900px] h-[900px] -ml-[450px] -mt-[450px] rounded-full border border-[var(--color-accent-primary)]"
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)',
            maskImage: 'linear-gradient(to bottom, black, transparent)',
          }}
        />
        {/* Radar sweep (frozen at a nice angle) */}
        <div
          className="absolute w-[900px] h-[900px] -ml-[450px] -mt-[450px] rounded-full"
          style={{
            background:
              'conic-gradient(from 220deg, transparent 70%, color-mix(in srgb, var(--color-accent-primary) 35%, transparent) 100%)',
          }}
        />
        {/* Crosshair */}
        <div className="absolute w-[1000px] h-[1px] bg-[var(--color-accent-primary)] opacity-40 dark:opacity-30 -ml-[500px]" />
        <div className="absolute w-[1px] h-[1000px] bg-[var(--color-accent-primary)] opacity-40 dark:opacity-30 -mt-[500px]" />
      </div>

      {/* --- TELEMETRY FLAT GRID --- */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-accent-primary) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-accent-primary) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 10%, transparent 90%)',
        }}
      />

      {/* Blueprint Nodes (static) */}
      {nodes.map((node) => (
        <div
          key={`node-${node.id}`}
          className="absolute w-16 h-16 border border-[var(--color-accent-primary)] dark:opacity-30"
          style={{ top: `${node.top}%`, left: `${node.left}%`, opacity: node.opacity }}
        >
          {/* Corner markers */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 dark:border-t border-l-2 dark:border-l border-[var(--color-accent-primary)]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 dark:border-t border-r-2 dark:border-r border-[var(--color-accent-primary)]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 dark:border-b border-l-2 dark:border-l border-[var(--color-accent-primary)]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 dark:border-b border-r-2 dark:border-r border-[var(--color-accent-primary)]" />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-[var(--color-accent-primary)]" />
        </div>
      ))}

      {/* --- DATA BEAMS (static, frozen mid-flight) --- */}
      <div className="absolute inset-0">
        {beams.map((beam) => (
          <div
            key={`beam-${beam.id}`}
            className="absolute h-[1px] w-[300px]"
            style={{
              top: `${beam.top}%`,
              left: `${beam.left}%`,
              background: `linear-gradient(to right, transparent, var(--color-accent-primary), transparent)`,
              opacity: beam.opacity,
            }}
          />
        ))}
      </div>

      {/* --- TELEMETRY DATA TEXT --- */}
      <div className="absolute top-[15%] left-[5%] text-[9px] font-mono font-bold dark:font-normal text-[var(--color-accent-primary)] opacity-100 dark:opacity-60 space-y-1">
        <p>SYS.TRK: ONLINE</p>
        <p>ORBIT_V: 89.22_</p>
        <p>SEC_AUTH: VERIFIED</p>
      </div>

      {/* Top and Bottom soft gradients to blend with adjacent sections */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-page-background)] via-transparent via-20% to-80% to-[var(--color-page-background)]" />
    </div>
  )
}
