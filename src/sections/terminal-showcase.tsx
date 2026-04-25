'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

import type { PortfolioTerminalHandle } from '@/components/ui/interactive-portfolio-terminal-component'
import PortfolioTerminal from '@/components/ui/interactive-portfolio-terminal-component'
import { portfolioTerminalCommands } from '@/lib/portfolio-terminal-commands'
import { portfolioTerminalContent } from '@/lib/portfolio-terminal-content'
import { Globe, Terminal } from 'lucide-react'
import * as motion from 'motion/react-client'
import { ScrambleText } from '@/components/ui/scramble-text'
import { useBootReady } from '@/lib/use-boot-ready'

const RotatingEarth = dynamic(() => import('@/components/ui/wireframe-dotted-globe'), {
  ssr: false,
  loading: () => <div className="relative z-10 h-[184px] w-full max-w-[18.5rem]" aria-hidden="true" />,
})

const GLOBE_INITIAL_ROTATION: [number, number] = [-31, -22]

export default function TerminalShowcase() {
  const bootReady = useBootReady()
  const terminalRef = useRef<PortfolioTerminalHandle>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [isGlobePaused, setIsGlobePaused] = useState(true)
  const [shouldMountDecor, setShouldMountDecor] = useState(false)

  useEffect(() => {
    if (!bootReady || shouldMountDecor) {
      return
    }

    const section = sectionRef.current

    if (!section) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return
        }

        setShouldMountDecor(true)
      },
      { rootMargin: '500px 0px' },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
    }
  }, [bootReady, shouldMountDecor])

  return (
    <section ref={sectionRef} id="terminal" className="relative py-24 md:py-28 px-6 md:px-10 overflow-hidden">
      {/* Page background */}
      <div className="absolute inset-0 bg-[var(--color-page-background)]" />

      {/* Top fade — blends with the section above */}
      <div className="absolute top-0 inset-x-0 h-56 bg-gradient-to-b from-[var(--color-page-background)] via-[color-mix(in_srgb,var(--color-page-background)_40%,transparent)] to-transparent z-10 pointer-events-none" />
      
      <div className="mx-auto max-w-[1420px] relative z-10">
        {/* Section Header */}
        <div className="mb-12 md:mb-14 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 relative group/header">
          {/* Large Background Watermark (Ghost Text) - Compact & Black */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none overflow-hidden opacity-[0.12] dark:opacity-[0.02] transition-opacity duration-1000 group-hover/header:opacity-[0.18] dark:group-hover/header:opacity-[0.04]">
            <span className="text-[5.5rem] md:text-[8rem] font-black tracking-tighter uppercase whitespace-nowrap text-[var(--color-accent-primary)] block text-right leading-none">
              Terminal
            </span>
          </div>

          {/* Corner Accents for Title Area */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-gradient-to-l from-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] to-transparent pointer-events-none" />
          
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold tracking-wide"
          >
            Terminal <span className="text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)]">Interface</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="h-[1px] w-8 md:w-16 bg-[var(--color-accent-primary)] hidden md:block" />
            <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--color-accent-primary)] font-bold cursor-default">
              <ScrambleText text="05 // EXECUTION ENVIRONMENT" delay={100} duration={1200} hoverScrambleDuration={400} />
            </span>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_360px] lg:gap-8">
          {/* Terminal Section */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.04 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full order-1 lg:order-1"
          >
            <div className="relative group">
              {/* Subtle Tech Accents (Simple and clean) */}
              <div className="absolute -top-3 -left-3 w-4 h-4 border-t border-l border-[var(--color-accent-primary)]/60 dark:border-[var(--color-accent-primary)]/40 group-hover:border-[var(--color-accent-primary)]/90 dark:group-hover:border-[var(--color-accent-primary)]/70 transition-colors pointer-events-none" />
              <div className="absolute -top-3 -right-3 w-4 h-4 border-t border-r border-[var(--color-accent-primary)]/60 dark:border-[var(--color-accent-primary)]/40 group-hover:border-[var(--color-accent-primary)]/90 dark:group-hover:border-[var(--color-accent-primary)]/70 transition-colors pointer-events-none" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b border-l border-[var(--color-accent-primary)]/60 dark:border-[var(--color-accent-primary)]/40 group-hover:border-[var(--color-accent-primary)]/90 dark:group-hover:border-[var(--color-accent-primary)]/70 transition-colors pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-4 h-4 border-b border-r border-[var(--color-accent-primary)]/60 dark:border-[var(--color-accent-primary)]/40 group-hover:border-[var(--color-accent-primary)]/90 dark:group-hover:border-[var(--color-accent-primary)]/70 transition-colors pointer-events-none" />
              
              <PortfolioTerminal ref={terminalRef} content={portfolioTerminalContent} />
            </div>
          </motion.div>

          {/* Technical Manifest Sidebar */}
          <div className="order-2 flex flex-col gap-8 lg:order-2">
            <div className="flex flex-col gap-4">
              {/* Cheat-sheet Panel */}
              <motion.div
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="min-w-0 overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-accent-primary)_15%,var(--color-hero-line))] bg-[color-mix(in_srgb,var(--color-hero-background)_40%,transparent)] p-4 backdrop-blur-md"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[color-mix(in_srgb,var(--color-page-foreground)_60%,transparent)] font-bold">Cheat-sheet</span>
                </div>

                <div className="space-y-2">
                  {portfolioTerminalCommands.map((item) => (
                    <motion.button
                      type="button"
                      key={item.command}
                      whileHover={{ x: 4 }}
                      onClick={() => terminalRef.current?.runCommand(item.command)}
                      className="flex w-full items-center justify-between gap-3 text-left group/item cursor-pointer"
                      aria-label={`Run ${item.command} in terminal`}
                    >
                      <code className="rounded bg-[var(--color-accent-primary)]/5 px-2 py-0.5 text-[9px] font-bold text-[var(--color-accent-primary)]">/ {item.command}</code>
                      <span className="text-[9px] font-mono text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)] group-hover/item:text-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)] transition-colors underline decoration-dotted decoration-[var(--color-accent-primary)]/20 underline-offset-4">{item.cheatSheetText}</span>
                    </motion.button>
                  ))}
                </div>

              </motion.div>

              <motion.div 
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onMouseEnter={() => setIsGlobePaused(false)}
                onMouseLeave={() => setIsGlobePaused(true)}
                className="hidden lg:block relative min-w-0 overflow-hidden rounded-[1.5rem] border border-[color-mix(in_srgb,var(--color-accent-primary)_15%,var(--color-hero-line))] bg-[color-mix(in_srgb,var(--color-hero-background)_40%,transparent)] p-4 backdrop-blur-md"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Globe className="h-4 w-4 text-[var(--color-accent-primary)]" />
                      <div className="absolute -inset-1 bg-[var(--color-accent-primary)]/10 blur-sm rounded-full" />
                    </div>
                     <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)]">
                      Remote Availability
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="rounded-full border border-[color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)] bg-[color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)] px-3 py-1 text-[9px] font-mono font-bold uppercase tracking-[0.1em] text-[var(--color-accent-primary)]">
                      Alexandria,Egy
                    </span>
                  </div>
                </div>

                <div className="relative flex min-h-[10.5rem] items-center justify-center overflow-hidden rounded-[1.25rem] border border-[color-mix(in_srgb,var(--color-accent-primary)_20%,var(--color-hero-line))] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent-primary)_12%,transparent),transparent_65%)] px-2 py-3 sm:min-h-[11rem] dark:border-[color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)] dark:bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-accent-primary)_7%,transparent),transparent_65%)]">
                  {/* Tactical HUD Elements - Discreet Placement */}
                  <div className="absolute inset-0 z-20 pointer-events-none p-3.5">
                    {/* Corners */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-[var(--color-accent-primary)]/40 rounded-tl-[12px]" />
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t border-r border-[var(--color-accent-primary)]/40 rounded-tr-[12px]" />
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b border-l border-[var(--color-accent-primary)]/40 rounded-bl-[12px]" />
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-[var(--color-accent-primary)]/40 rounded-br-[12px]" />
                    
                    {/* Data Labels */}
                    <div className="absolute bottom-3 left-7 flex gap-2 font-mono text-[6px] text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)] uppercase tracking-[0.15em]">
                      <span>31.2001°N</span>
                      <span className="opacity-40">/</span>
                      <span>29.9187°E</span>
                    </div>
                    

                  </div>

                  <div className="pointer-events-none absolute inset-x-10 top-6 h-16 rounded-full bg-[var(--color-accent-primary)]/20 dark:bg-[var(--color-accent-primary)]/12 blur-3xl opacity-80" />
                  <div className="pointer-events-none absolute inset-x-12 bottom-4 h-14 rounded-full bg-[color-mix(in_srgb,var(--color-accent-tertiary)_25%,transparent)] dark:bg-[color-mix(in_srgb,var(--color-accent-tertiary)_18%,transparent)] blur-3xl opacity-80" />
                  
                  {shouldMountDecor ? (
                    <RotatingEarth
                      width={296}
                      height={184}
                      initialRotation={GLOBE_INITIAL_ROTATION}
                      rotationSpeed={0.22}
                      scaleMultiplier={1.05}
                      isPaused={isGlobePaused}
                      className="relative z-10 max-w-[18.5rem]"
                    />
                  ) : <div className="relative z-10 h-[184px] w-full max-w-[18.5rem]" aria-hidden="true" />}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

    </section>
    
  )
}
