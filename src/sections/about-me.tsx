'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import * as motion from 'motion/react-client'
import { X, Minus, User, Code2, Mail, Terminal, ExternalLink, Wifi, GripHorizontal, Globe, LayoutGrid, Smile } from 'lucide-react'
import { profileLinks } from '@/lib/profile'
import { AboutBackground } from './about-background'
import { ScrambleText } from '@/components/ui/scramble-text'
import { cn } from '@/lib/utils'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type WindowId = 'profile' | 'bio' | 'stack' | 'contact'

interface WindowMeta {
  id: WindowId
  title: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  accentVar: string
  pos: { x: number; y: number }
  width: number
  maxH?: number
}

interface WinState {
  open: boolean
  minimized: boolean
  z: number
}

// ─────────────────────────────────────────────────────────────────────────────
// Window config
// ─────────────────────────────────────────────────────────────────────────────

const WINDOWS: WindowMeta[] = [
  {
    id: 'profile',
    title: 'profile.sys',
    icon: User,
    accentVar: '--color-accent-primary',
    pos: { x: 40, y: 22 },
    width: 268,
  },
  {
    id: 'bio',
    title: 'bio.txt',
    icon: Terminal,
    accentVar: '--color-accent-primary',
    pos: { x: 320, y: 30 },
    width: 490,
    maxH: 320,
  },
  {
    id: 'stack',
    title: 'focus.json',
    icon: Code2,
    accentVar: '--color-accent-primary',
    pos: { x: 825, y: 70 },
    width: 296,
    maxH: 220,
  },
  {
    id: 'contact',
    title: 'contact.sh',
    icon: Mail,
    accentVar: '--color-accent-primary',
    pos: { x: 180, y: 235 },
    width: 256,
  },
]

const INIT: Record<WindowId, WinState> = {
  profile: { open: true, minimized: false, z: 10 },
  bio:     { open: true, minimized: false, z: 11 },
  stack:   { open: true, minimized: false, z: 9  },
  contact: { open: false, minimized: false, z: 12 },
}

// ─────────────────────────────────────────────────────────────────────────────
// Window content
// ─────────────────────────────────────────────────────────────────────────────

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1 border-b border-[color-mix(in_srgb,var(--color-page-foreground)_5%,transparent)] last:border-0">
      <span className="text-[8.5px] font-mono tracking-[0.18em] font-bold text-[var(--color-page-foreground)]/25 shrink-0 uppercase mt-[1px]">
        {label}
      </span>
      <div className="text-[10.5px] font-mono text-[var(--color-page-foreground)]/65 text-right leading-tight">
        {children}
      </div>
    </div>
  )
}

function ProfileContent() {
  return (
    <div className="p-4 flex flex-col gap-0.5">
      {/* Avatar row */}
      <div className="flex items-center gap-3 pb-3 mb-2 border-b border-[color-mix(in_srgb,var(--color-page-foreground)_6%,transparent)]">
        <div className="w-9 h-9 rounded-sm bg-[var(--color-accent-primary)]/15 border border-[var(--color-accent-primary)]/25 flex items-center justify-center shrink-0">
          <span className="text-[var(--color-accent-primary)] font-black text-xs tracking-tight">ZS</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-[var(--color-page-foreground)]/85 leading-tight">Ziad Said Ahmed</span>
          <span className="text-[9px] font-mono text-[var(--color-accent-primary)]/70 mt-0.5">Full Stack Developer</span>
        </div>
      </div>
      <InfoRow label="LOCATION">Cairo, Egypt</InfoRow>
      <InfoRow label="STATUS">
        <span className="flex items-center justify-end gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-emerald-500">Available</span>
        </span>
      </InfoRow>
      <InfoRow label="EXPERIENCE">2+ Years</InfoRow>
      <InfoRow label="DOMAINS">SaaS · CRM · Integrations</InfoRow>
      <InfoRow label="AI_POWERED">
        <span className="text-emerald-500">true</span>
      </InfoRow>
      <InfoRow label="KERNEL">v2.4.1_stable</InfoRow>
    </div>
  )
}

function BioContent() {
  return (
    <div className="p-5 flex flex-col gap-4 overflow-y-auto" style={{ maxHeight: 310 }}>
      <span className="text-[9px] font-mono tracking-widest text-[var(--color-page-foreground)]/25 select-none">
        // bio.txt — read only
      </span>
      <p className="text-[14px] leading-[1.85] text-[var(--color-page-foreground)]/75 font-sans">
        I'm a{' '}
        <span className="text-[var(--color-accent-primary)] font-semibold">Full Stack Developer</span>{' '}
        contributing to SaaS products, CRM systems, and messaging platforms —
        solving complex technical issues and improving integrations across services.
      </p>
      <p className="text-[14px] leading-[1.85] text-[var(--color-page-foreground)]/75 font-sans">
        My work includes debugging production issues, investigating system behavior
        with{' '}
        <span className="text-[var(--color-accent-primary)] font-semibold">Datadog</span>,
        and resolving problems related to webhooks, message flows, and real-time updates.
      </p>
      <p className="text-[14px] leading-[1.85] text-[var(--color-page-foreground)]/75 font-sans">
        What sets me apart is being{' '}
        <span className="text-[var(--color-accent-primary)] font-semibold">solution-oriented</span>{' '}
        and persistent. I use AI as part of my workflow to speed up research and
        support development while maintaining engineering quality.
      </p>
    </div>
  )
}

function StackContent() {
  const entries: [string, string | string[] | boolean][] = [
    ['domains',    ['SaaS products', 'CRM systems', 'Messaging']],
    ['tools',      ['Datadog', 'Webhooks', 'Real-time flows']],
    ['layers',     ['Frontend', 'Backend', 'Integrations']],
    ['approach',   'solution-oriented'],
    ['ai_powered', true],
  ]

  return (
    <div className="p-4 font-mono text-[10px] overflow-y-auto">
      <span className="text-[8px] tracking-widest text-[var(--color-page-foreground)]/25 block mb-2">
        // focus.json
      </span>
      <div className="leading-[1.85] text-[var(--color-page-foreground)]/55">
        <span className="text-[var(--color-page-foreground)]/25">{'{'}</span>
        {entries.map(([key, val], idx) => (
          <div key={key} className="pl-4">
            <span className="text-[var(--color-accent-primary)]">"{key}"</span>
            <span className="text-[var(--color-page-foreground)]/25">: </span>
            {Array.isArray(val) ? (
              <>
                <span className="text-[var(--color-page-foreground)]/25">{'['}</span>
                {val.map((item, i) => (
                  <div key={i} className="pl-4">
                    <span className="text-[var(--color-page-foreground)]/55">"{item}"</span>
                    {i < val.length - 1 && <span className="text-[var(--color-page-foreground)]/25">,</span>}
                  </div>
                ))}
                <span className="text-[var(--color-page-foreground)]/25">{']'}</span>
              </>
            ) : typeof val === 'boolean' ? (
              <span className="text-emerald-500">{String(val)}</span>
            ) : (
              <span className="text-[var(--color-page-foreground)]/55">"{val}"</span>
            )}
            {idx < entries.length - 1 && <span className="text-[var(--color-page-foreground)]/25">,</span>}
          </div>
        ))}
        <span className="text-[var(--color-page-foreground)]/25">{'}'}</span>
      </div>
    </div>
  )
}

function ContactContent() {
  const links = [
    { cmd: 'whatsapp', href: profileLinks.whatsapp, hint: '+20 101 069 5751' },
    { cmd: 'linkedin', href: profileLinks.linkedin,  hint: 'in/ziadsaid'      },
    { cmd: 'github',   href: profileLinks.github,    hint: 'ziadsaid2'        },
    { cmd: 'email',    href: `mailto:${profileLinks.email}`, hint: 'ziadsaid...' },
  ]

  return (
    <div className="p-4 font-mono text-[10px] flex flex-col gap-1">
      <span className="text-[8px] tracking-widest text-[var(--color-page-foreground)]/25 mb-2">
        # contact.sh — click any line
      </span>
      {links.map(({ cmd, href, hint }) => (
        <a
          key={cmd}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-2 px-2 py-1.5 -mx-1 rounded-sm hover:bg-[var(--color-accent-primary)]/10 transition-colors group/link"
        >
          <span className="text-[var(--color-page-foreground)]/25">$</span>
          <span className="text-[var(--color-accent-primary)]">open</span>
          <span className="text-[var(--color-page-foreground)]/50">{cmd}</span>
          <span className="text-[var(--color-page-foreground)]/20 flex-1 truncate text-[8.5px]"># {hint}</span>
          <ExternalLink className="w-2.5 h-2.5 text-[var(--color-page-foreground)]/15 group-hover/link:text-[var(--color-accent-primary)]/60 transition-colors shrink-0" />
        </a>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// OS Window shell
// ─────────────────────────────────────────────────────────────────────────────

const CONTENT: Record<WindowId, React.ReactNode> = {
  profile: <ProfileContent />,
  bio:     <BioContent />,
  stack:   <StackContent />,
  contact: <ContactContent />,
}

function OsWindow({
  meta,
  state,
  onClose,
  onMinimize,
  onFocus,
  constraintsRef,
}: {
  meta: WindowMeta
  state: WinState
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  constraintsRef: React.RefObject<HTMLDivElement>
}) {
  const Icon = meta.icon

  if (!state.open || state.minimized) return null

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.08}
      dragMomentum={true}
      dragTransition={{ power: 0.05, timeConstant: 400, bounceStiffness: 120, bounceDamping: 25 }}
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onPointerDown={onFocus}
      onDragStart={onFocus}
      className={cn(
        "absolute rounded-lg overflow-hidden border border-[color-mix(in_srgb,var(--color-page-foreground)_9%,transparent)] bg-[var(--color-page-background)]",
        "max-md:!left-4 max-md:!w-[calc(100%-32px)]",
        meta.id === 'profile' && "max-md:!top-[40px]",
        meta.id === 'bio' && "max-md:!top-[55px]",
        meta.id === 'stack' && "max-md:!top-[70px]",
        meta.id === 'contact' && "max-md:!top-[85px]",
      )}
      style={{
        top: meta.pos.y,
        left: meta.pos.x,
        width: meta.width,
        zIndex: state.z,
        boxShadow: `0 8px 24px rgba(0,0,0,0.12)`,
      }}
    >
      {/* ── Title bar ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[color-mix(in_srgb,var(--color-page-foreground)_7%,transparent)] bg-[color-mix(in_srgb,var(--color-page-foreground)_2.5%,transparent)] cursor-grab active:cursor-grabbing select-none">
        {/* Traffic lights */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose() }}
            className="w-[11px] h-[11px] rounded-full bg-[#FF5F57] hover:brightness-110 transition-all flex items-center justify-center group/tl"
          >
            <X className="w-[7px] h-[7px] text-[#7d0000]/60 opacity-0 group-hover/tl:opacity-100" />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
            className="w-[11px] h-[11px] rounded-full bg-[#FEBC2E] hover:brightness-110 transition-all flex items-center justify-center group/tl"
          >
            <Minus className="w-[7px] h-[7px] text-[#7d5000]/60 opacity-0 group-hover/tl:opacity-100" />
          </button>
          <div className="w-[11px] h-[11px] rounded-full bg-[color-mix(in_srgb,var(--color-page-foreground)_12%,transparent)]" />
        </div>

        {/* Title */}
        <div className="flex-1 flex items-center justify-center gap-1.5 pointer-events-none overflow-hidden">
          <Icon
            className="w-[9px] h-[9px] shrink-0 opacity-35"
            style={{ color: `var(${meta.accentVar})` }}
          />
          <span className="text-[8.5px] font-mono tracking-[0.18em] text-[var(--color-page-foreground)]/35 uppercase truncate">
            {meta.title}
          </span>
        </div>

        {/* Drag handle visual hint */}
        <div className="flex items-center gap-1.5 text-[var(--color-page-foreground)]/20 shrink-0 select-none pointer-events-none hidden sm:flex">
          <span className="text-[7.5px] font-mono uppercase tracking-[0.15em] mt-[1px]">DRAG</span>
          <GripHorizontal className="w-3 h-3" />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxHeight: meta.maxH ?? 'none', overflowY: meta.maxH ? 'auto' : 'visible' }}>
        {CONTENT[meta.id]}
      </div>
    </motion.div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────────────────────────────────────

export default function AboutMeSection() {
  const [wins, setWins] = useState<Record<WindowId, WinState>>(INIT)
  const topZRef = useRef(20)
  const desktopRef = useRef<HTMLDivElement>(null!)
  const [clockTime, setClockTime] = useState('')

  useEffect(() => {
    const tick = () =>
      setClockTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const bringToFront = useCallback((id: WindowId) => {
    const next = ++topZRef.current
    setWins(prev => ({ ...prev, [id]: { ...prev[id], z: next } }))
  }, [])

  const closeWin = useCallback((id: WindowId) =>
    setWins(prev => ({ ...prev, [id]: { ...prev[id], open: false } })), [])

  const minimizeWin = useCallback((id: WindowId) =>
    setWins(prev => ({ ...prev, [id]: { ...prev[id], minimized: true } })), [])

  const openWin = useCallback((id: WindowId) => {
    const next = ++topZRef.current
    setWins(prev => ({ ...prev, [id]: { open: true, minimized: false, z: next } }))
  }, [])

  return (
    <section
      id="about"
      className="relative w-full overflow-hidden py-16 px-6 md:px-10 flex flex-col"
    >
      {/* Page background */}
      <div className="absolute inset-0 bg-[var(--color-page-background)]" />

      <AboutBackground />

      <div className="mx-auto max-w-[1420px] relative z-10 w-full">

        {/* ── Section header ── */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
          className="mb-12 flex flex-row flex-wrap items-center gap-4 md:gap-6 relative group/header"
        >
          <div className="absolute -top-4 -left-4 w-6 h-6 border-t border-l border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] rounded-tl-md pointer-events-none" />

          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none overflow-hidden opacity-[0.12] dark:opacity-[0.03]">
            <span className="text-[5.5rem] md:text-[8rem] font-black tracking-tighter uppercase whitespace-nowrap text-[var(--color-accent-primary)] block text-right leading-none">
              About
            </span>
          </div>

          <motion.h2
            variants={{
              hidden:   { opacity: 0, y: 30 },
              visible:  { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="text-3xl md:text-5xl font-bold tracking-wide whitespace-nowrap"
          >
            About <span className="text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)]">Me</span>
          </motion.h2>

          <motion.div
            variants={{
              hidden:  { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="h-px w-5 md:w-10 bg-[var(--color-accent-primary)] hidden md:block" />
            <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--color-accent-primary)] font-bold cursor-default">
              <ScrambleText text="02 // SOLUTION MINDSET" delay={100} duration={1200} hoverScrambleDuration={400} />
            </span>
          </motion.div>
        </motion.div>

        {/* ── Desktop ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.85, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-xl overflow-hidden max-w-6xl mx-auto w-full"
          style={{
            height: 540,
            border: '1px solid color-mix(in srgb, var(--color-page-foreground) 11%, transparent)',
            boxShadow: '0 0 0 1px color-mix(in srgb, var(--color-accent-primary) 10%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-page-foreground) 10%, transparent), 0 24px 48px rgba(0,0,0,0.13)',
          }}
        >
          {/* ── macOS Menu Bar ── */}
          <div className="absolute top-0 inset-x-0 h-7 z-40 flex items-center justify-between px-3 border-b border-[color-mix(in_srgb,var(--color-page-foreground)_7%,transparent)] bg-[color-mix(in_srgb,var(--color-page-background)_88%,transparent)] backdrop-blur-sm select-none">
            {/* Left: menus */}
            <div className="flex items-center gap-4">
              {['File', 'Edit', 'View', 'Window'].map(m => (
                <span key={m} className="text-[9px] font-medium text-[var(--color-page-foreground)]/30 cursor-default hidden sm:block">{m}</span>
              ))}
            </div>
            {/* Center: app name */}
            <span className="absolute left-1/2 -translate-x-1/2 text-[9px] font-semibold tracking-wide text-[var(--color-page-foreground)]/35 pointer-events-none">
              zs.portfolio
            </span>
            {/* Right: status */}
            <div className="flex items-center gap-2 text-[var(--color-page-foreground)]/35">
              <Wifi className="w-2.5 h-2.5" />
              {clockTime && (
                <span className="text-[9px] font-mono tabular-nums">{clockTime}</span>
              )}
            </div>
          </div>

          {/* Desktop dot-grid wallpaper */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, color-mix(in srgb, var(--color-page-foreground) 6%, transparent) 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* Noise / grain texture */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,color-mix(in_srgb,var(--color-page-background)_35%,transparent)_100%)] pointer-events-none" />


          {/* Drag area — windows are constrained to this ref */}
          <div ref={desktopRef} className="absolute inset-x-0 bottom-0" style={{ top: 28, bottom: 56 }}>


            {/* Windows */}
            {WINDOWS.map(m => (
              <OsWindow
                key={m.id}
                meta={m}
                state={wins[m.id]}
                onClose={() => closeWin(m.id)}
                onMinimize={() => minimizeWin(m.id)}
                onFocus={() => bringToFront(m.id)}
                constraintsRef={desktopRef}
              />
            ))}
          </div>

          {/* ── macOS-style Dock ── */}
          <div className="absolute bottom-2 inset-x-0 h-14 flex items-center justify-center md:justify-between px-2 md:px-4 z-50">

            {/* Status — left */}
            <div className="hidden md:flex items-center gap-2 opacity-40">
              <Wifi className="w-3 h-3 text-[var(--color-page-foreground)]/50" />
            </div>

            {/* Dock icons — center */}
            <div className="flex items-end gap-0.5 sm:gap-1 px-2 sm:px-3 py-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-page-foreground)_8%,transparent)] bg-[var(--color-page-background)]">

              {/* Decorative system apps */}
              {([
                { icon: Smile,      label: 'Finder',    bg: 'color-mix(in srgb, var(--color-page-foreground) 6%, transparent)', border: 'color-mix(in srgb, var(--color-page-foreground) 10%, transparent)' },
                { icon: Globe,      label: 'Safari',    bg: 'color-mix(in srgb, var(--color-page-foreground) 6%, transparent)', border: 'color-mix(in srgb, var(--color-page-foreground) 10%, transparent)' },
                { icon: LayoutGrid, label: 'Launchpad', bg: 'color-mix(in srgb, var(--color-page-foreground) 6%, transparent)', border: 'color-mix(in srgb, var(--color-page-foreground) 10%, transparent)' },
              ] as const).map(({ icon: Icon, label, bg, border }) => (
                <div key={label} className="flex flex-col items-center">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center cursor-default"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <Icon className="w-[18px] h-[18px] opacity-30" strokeWidth={1.8} />
                  </div>
                  <span className="w-1 h-1 rounded-full mt-0.5 opacity-0" />
                </div>
              ))}

              {/* Separator */}
              <div className="w-px h-8 mx-1 self-center rounded-full bg-[color-mix(in_srgb,var(--color-page-foreground)_10%,transparent)]" />

              {/* Functional windows */}
              {WINDOWS.map(m => {
                const s = wins[m.id]
                const Icon = m.icon
                const isActive = s.open && !s.minimized
                return (
                  <div key={m.id} className="relative group/dock flex flex-col items-center">
                    {/* Tooltip */}
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-[8px] font-mono tracking-widest whitespace-nowrap rounded-sm border border-[var(--color-accent-primary)]/20 bg-[var(--color-page-background)] text-[var(--color-accent-primary)]/70 opacity-0 group-hover/dock:opacity-100 transition-opacity duration-150 pointer-events-none z-50">
                      {m.title}
                    </span>
                    <button
                      onClick={() => isActive ? minimizeWin(m.id) : openWin(m.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-125 origin-bottom"
                      style={{
                        background: isActive
                          ? `color-mix(in srgb, var(${m.accentVar}) 14%, transparent)`
                          : `color-mix(in srgb, var(--color-page-foreground) 5%, transparent)`,
                        border: `1px solid color-mix(in srgb, var(${m.accentVar}) ${isActive ? 20 : 8}%, transparent)`,
                      }}
                    >
                      <Icon
                        className="w-4 h-4 transition-opacity duration-200"
                        style={{ color: `var(${m.accentVar})`, opacity: isActive ? 0.85 : 0.35 }}
                      />
                    </button>
                    {/* Active dot */}
                    <span className={cn(
                      'w-1 h-1 rounded-full mt-0.5 transition-all duration-200',
                      isActive ? 'opacity-70' : 'opacity-0'
                    )} style={{ background: `var(${m.accentVar})` }} />
                  </div>
                )
              })}
            </div>

            {/* Spacer — right (mirrors left status width) */}
            <div className="hidden md:block w-20" />
          </div>
        </motion.div>



      </div>

      {/* Full-width name sign-off */}
      {/* <SignOff /> */}
    </section>
  )
}
