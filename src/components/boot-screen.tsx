'use client'

import { useEffect, useState, useCallback } from 'react'

import { markBootReady } from '@/lib/use-boot-ready'

const BOOT_LINES = [
  { text: 'SYS.INIT — KERNEL v4.2.1', delay: 0 },
  { text: 'AUTH.MODULE: VERIFIED', delay: 200 },
  { text: 'LOADING VISUAL ENGINE...', delay: 500 },
  { text: 'COMPILING INTERFACE NODES...', delay: 900 },
  { text: 'RENDERING SUBSYSTEM: ACTIVE', delay: 1400 },
  { text: 'NETWORK BRIDGE: CONNECTED', delay: 1800 },
  { text: 'ALL SYSTEMS NOMINAL ✓', delay: 2300 },
]

const TOTAL_BOOT_DURATION = 2800

export default function BootScreen() {
  const [phase, setPhase] = useState<'boot' | 'prompt' | 'exit'>('boot')
  const [visibleLines, setVisibleLines] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)

  // Boot sequence — waits for BOTH animation AND real page load
  useEffect(() => {
    if (isDismissed) return

    let animationDone = false
    let pageLoaded = document.readyState === 'complete'
    let cancelled = false

    const tryShowPrompt = () => {
      if (animationDone && pageLoaded && !cancelled) {
        setTimeout(() => setPhase('prompt'), 300)
      }
    }

    // Track real page load
    if (!pageLoaded) {
      const onLoad = () => {
        pageLoaded = true
        tryShowPrompt()
      }
      window.addEventListener('load', onLoad)
      // Cleanup in case load already fired
      if (document.readyState === 'complete') {
        pageLoaded = true
      }
    }

    // Reveal boot lines one by one
    BOOT_LINES.forEach((_, i) => {
      setTimeout(() => setVisibleLines(i + 1), BOOT_LINES[i].delay)
    })

    // Animate progress — syncs with real load if possible
    const startTime = performance.now()
    let rafId: number

    const animateProgress = (now: number) => {
      if (cancelled) return
      const elapsed = now - startTime
      
      // If page isn't loaded yet, slow down progress at 85%
      const maxProgress = pageLoaded ? 100 : 85
      const duration = pageLoaded ? TOTAL_BOOT_DURATION : TOTAL_BOOT_DURATION * 1.5
      
      const p = Math.min(elapsed / duration, 1)
      const eased = p < 0.5
        ? 2 * p * p
        : 1 - Math.pow(-2 * p + 2, 2) / 2
      
      const currentProgress = Math.round(eased * maxProgress)
      setProgress(currentProgress)

      if (currentProgress < 100) {
        rafId = requestAnimationFrame(animateProgress)
      } else {
        animationDone = true
        tryShowPrompt()
      }
    }

    rafId = requestAnimationFrame(animateProgress)

    return () => {
      cancelled = true
      cancelAnimationFrame(rafId)
    }
  }, [isDismissed])

  const dismiss = useCallback(() => {
    setPhase('exit')
    setTimeout(() => {
      markBootReady()
      setIsDismissed(true)
    }, 700)
  }, [])

  const handleAudio = useCallback((enable: boolean) => {
    if (enable) {
      try {
        const ctx = new AudioContext()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(80, ctx.currentTime)
        gain.gain.setValueAtTime(0, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start()
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 4)
        osc.stop(ctx.currentTime + 4.1)
      } catch {
        // Audio not supported
      }
    }
    dismiss()
  }, [dismiss])

  if (isDismissed) return null

  return (
    <>
      <div
        data-boot-screen
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--color-page-background)',
          color: 'var(--color-page-foreground)',
          fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', 'Fira Code', monospace",
          opacity: phase === 'exit' ? 0 : 1,
          transform: phase === 'exit' ? 'scale(1.02)' : 'scale(1)',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: phase === 'exit' ? 'none' : 'auto',
          isolation: 'isolate',
          cursor: 'default',
        }}
        role="dialog"
        aria-label="System boot sequence"
      >
        {/* Scanlines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(128,128,128,0.03) 2px, rgba(128,128,128,0.03) 4px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {/* Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            backgroundImage: 'linear-gradient(to right, var(--color-accent-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-accent-primary) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Glow 1 */}
        <div
          style={{
            position: 'absolute',
            top: '-15%',
            left: '-10%',
            width: '50vw',
            height: '50vw',
            maxWidth: 600,
            maxHeight: 600,
            borderRadius: '50%',
            background: 'var(--color-accent-primary)',
            opacity: 0.07,
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        {/* Glow 2 */}
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            right: '-5%',
            width: '40vw',
            height: '40vw',
            maxWidth: 500,
            maxHeight: 500,
            borderRadius: '50%',
            background: 'var(--color-accent-tertiary)',
            opacity: 0.05,
            filter: 'blur(100px)',
            pointerEvents: 'none',
          }}
        />

        {/* Main content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 520,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid color-mix(in srgb, var(--color-page-foreground) 10%, transparent)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--color-accent-primary)',
                  boxShadow: '0 0 8px var(--color-accent-primary)',
                  animation: 'boot-pulse 1.5s ease-in-out infinite',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  color: 'var(--color-accent-primary)',
                }}
              >
                ZIAD.SYS
              </span>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: 'color-mix(in srgb, var(--color-page-foreground) 40%, transparent)',
              }}
            >
              {phase === 'boot' ? 'INITIALIZING...' : phase === 'prompt' ? 'READY' : 'LAUNCHING'}
            </span>
          </div>

          {/* Boot log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minHeight: 170 }}>
            {BOOT_LINES.map((line, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: i < visibleLines ? 1 : 0,
                  transform: i < visibleLines ? 'translateY(0)' : 'translateY(4px)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  fontSize: 12,
                  letterSpacing: '0.06em',
                }}
              >
                <span style={{ color: 'var(--color-accent-primary)', fontWeight: 700 }}>▸</span>
                <span
                  style={{
                    color: i === visibleLines - 1 && i === BOOT_LINES.length - 1
                      ? 'var(--color-accent-primary)'
                      : 'color-mix(in srgb, var(--color-page-foreground) 60%, transparent)',
                    fontWeight: i === visibleLines - 1 && i === BOOT_LINES.length - 1 ? 600 : 400,
                  }}
                >
                  {line.text}
                </span>
                {i === visibleLines - 1 && phase === 'boot' && (
                  <span
                    style={{
                      animation: 'boot-blink 0.6s step-end infinite',
                      color: 'var(--color-accent-primary)',
                      fontWeight: 700,
                    }}
                  >
                    _
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                flex: 1,
                height: 3,
                background: 'color-mix(in srgb, var(--color-page-foreground) 8%, transparent)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-tertiary))',
                  borderRadius: 2,
                  transition: 'width 0.1s linear',
                  boxShadow: '0 0 8px var(--color-accent-primary)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'color-mix(in srgb, var(--color-page-foreground) 50%, transparent)',
                minWidth: '2.5rem',
                textAlign: 'right' as const,
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid color-mix(in srgb, var(--color-page-foreground) 6%, transparent)',
              fontSize: 8,
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: 'color-mix(in srgb, var(--color-page-foreground) 20%, transparent)',
            }}
          >
            <span>PORTFOLIO.EXE</span>
            <span>v2.0.0</span>
            <span>2024 — PRESENT</span>
          </div>
        </div>

        {/* Audio prompt — top right */}
        <div
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            zIndex: 3,
            opacity: phase === 'prompt' ? 1 : 0,
            transform: phase === 'prompt' ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.98)',
            transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: phase === 'prompt' ? 'auto' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              padding: '1.5rem',
              border: '1px solid color-mix(in srgb, var(--color-page-foreground) 8%, transparent)',
              background: 'color-mix(in srgb, var(--color-page-foreground) 2%, transparent)',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.7 }}
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>

            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: 'color-mix(in srgb, var(--color-page-foreground) 70%, transparent)',
                margin: 0,
              }}
            >
              Enable ambient audio?
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => handleAudio(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.6rem 1.8rem',
                  border: '1px solid var(--color-accent-primary)',
                  background: 'transparent',
                  color: 'var(--color-accent-primary)',
                  fontFamily: 'inherit',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'color-mix(in srgb, var(--color-accent-primary) 10%, transparent)'
                  e.currentTarget.style.boxShadow = '0 0 20px color-mix(in srgb, var(--color-accent-primary) 25%, transparent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                ENABLE
              </button>
              <button
                type="button"
                onClick={() => handleAudio(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.6rem 1.8rem',
                  border: '1px solid color-mix(in srgb, var(--color-page-foreground) 15%, transparent)',
                  background: 'transparent',
                  color: 'color-mix(in srgb, var(--color-page-foreground) 50%, transparent)',
                  fontFamily: 'inherit',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase' as const,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-page-foreground) 30%, transparent)'
                  e.currentTarget.style.color = 'color-mix(in srgb, var(--color-page-foreground) 70%, transparent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'color-mix(in srgb, var(--color-page-foreground) 15%, transparent)'
                  e.currentTarget.style.color = 'color-mix(in srgb, var(--color-page-foreground) 50%, transparent)'
                }}
              >
                SKIP
              </button>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        [data-boot-screen],
        [data-boot-screen] * {
          cursor: default !important;
        }
        [data-boot-screen] button {
          cursor: pointer !important;
        }
        @keyframes boot-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes boot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}} />
    </>
  )
}
