'use client'

import { useState } from 'react'
import * as motion from 'motion/react-client'
import { ExternalLink } from 'lucide-react'
import { ScrambleText } from '@/components/ui/scramble-text'

// ─────────────────────────────────────────────────────────────────────────────

const CERTS = [
  {
    num: '01',
    id: 'UC-332e...fe46c',
    title: 'AI For Backend Engineers',
    issuer: 'Udemy',
    month: 'FEB_2026',
    desc: 'Integrating AI tooling into backend workflows — from Cursor-driven development to building and consuming MCP servers.',
    skills: ['Cursor', 'MCP', 'LLMs', 'Prompt Engineering', 'Automation'],
    href: 'https://www.udemy.com/certificate/UC-332e520e-f8ec-4e60-8e8c-0398d73fe46c/',
  },
  {
    num: '02',
    id: 'UC-e5d4...832b2',
    title: 'Laravel 12: Complete Guide',
    issuer: 'Udemy',
    month: 'FEB_2026',
    desc: 'Full-depth coverage of Laravel 12 — routing, Eloquent ORM, queues, authentication, and RESTful API design.',
    skills: ['Laravel 12', 'PHP 8.x', 'Eloquent ORM', 'Blade', 'Redis'],
    href: 'https://www.udemy.com/certificate/UC-e5d43888-cf4e-4a1c-9e9f-a01fc70832b2/',
  },
  {
    num: '03',
    id: '7343...AC59E',
    title: 'Git and GitHub',
    issuer: 'Almdrasa',
    month: 'JAN_2026',
    desc: 'Version control fundamentals through advanced branching strategies, rebasing, and collaborative workflows on GitHub.',
    skills: ['Git', 'GitHub', 'CI/CD', 'Branching', 'Actions'],
    href: 'https://drive.google.com/file/d/1F2lJBsHl-Xx1IZnHezCb_6Icfi86Xxc-/view?usp=sharing',
  },
  {
    num: '04',
    id: 'AMIT-FS-2025',
    title: 'Full Stack Node.js Diploma',
    issuer: 'AMIT Learning',
    month: 'JUN_2025',
    desc: 'End-to-end web development covering JavaScript, Node.js, Express, MongoDB, and modern frontend fundamentals.',
    skills: ['Node.js', 'Express', 'MongoDB', 'React', 'JavaScript', 'Rest API'],
    href: 'https://drive.google.com/file/d/1HJLeEaLsrmjykmaLO10IeSXPY59gV5JM/view?usp=sharing',
  },
  {
    num: '05',
    id: 'ziadsaid-rwd',
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    month: 'MAY_2025',
    desc: 'Semantic HTML, modern CSS layout systems (Flexbox, Grid), accessibility practices, and adaptive design principles.',
    skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Accessibility'],
    href: 'https://www.freecodecamp.org/certification/ziadsaid-rwd/responsive-web-design',
  },
] as const

const PUBLIC_CERT_COUNT = CERTS.filter(({ href }) => (href as string) !== '#').length
const SKILL_COUNT = new Set(CERTS.flatMap(({ skills }) => [...skills])).size

// ─────────────────────────────────────────────────────────────────────────────

function Barcode({ id, active }: { id: string; active: boolean }) {
  const bars = Array.from({ length: 34 }, (_, i) => {
    const c = id.charCodeAt(i % id.length)
    return {
      w: ((c * (i + 3)) % 3) + 1,
      h: active ? 10 + ((c * 11 + i * 17) % 20) : 5 + ((c * 11 + i * 17) % 10),
    }
  })

  const guardOpacity = active ? 65 : 32

  return (
    <div>
      <div className="flex items-end" style={{ height: '32px', gap: '1.5px' }}>
        {/* Left guard bars */}
        <div
          className="self-stretch w-px"
          style={{
            background: `color-mix(in srgb, var(--color-accent-primary) ${guardOpacity}%, transparent)`,
            transition: 'background 0.35s ease',
          }}
        />
        <div
          className="self-stretch w-px"
          style={{
            background: `color-mix(in srgb, var(--color-accent-primary) ${guardOpacity}%, transparent)`,
            transition: 'background 0.35s ease',
          }}
        />
        <div className="w-[3px]" />

        {bars.map((bar, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{
              width: bar.w + 'px',
              height: bar.h + 'px',
              background: `color-mix(in srgb, var(--color-accent-primary) ${active ? 58 : 24}%, transparent)`,
              transition: `height 0.28s ease ${i * 2}ms, background 0.35s ease`,
            }}
          />
        ))}

        {/* Right guard bars */}
        <div className="w-[3px]" />
        <div
          className="self-stretch w-px"
          style={{
            background: `color-mix(in srgb, var(--color-accent-primary) ${guardOpacity}%, transparent)`,
            transition: 'background 0.35s ease',
          }}
        />
        <div
          className="self-stretch w-px"
          style={{
            background: `color-mix(in srgb, var(--color-accent-primary) ${guardOpacity}%, transparent)`,
            transition: 'background 0.35s ease',
          }}
        />
      </div>

      <span
        className="mt-1.5 block text-[6px] font-mono tracking-[0.22em]"
        style={{
          color: `color-mix(in srgb, var(--color-page-foreground) ${active ? 50 : 28}%, transparent)`,
          transition: 'color 0.35s ease',
        }}
      >
        {id}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function CertRow({ cert, index }: { cert: typeof CERTS[number]; index: number }) {
  const [hovered, setHovered] = useState(false)
  const hasCredential = (cert.href as string) !== '#'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ delay: index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex-1 flex flex-col"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Drawer depth shadow — appears below the lifted card */}
      <div
        className="pointer-events-none absolute inset-x-4 bottom-0 -z-10 h-5 rounded-b"
        style={{
          background: 'color-mix(in srgb, var(--color-accent-primary) 18%, transparent)',
          filter: 'blur(12px)',
          opacity: hovered ? 1 : 0,
          transform: `translateY(${hovered ? '10px' : '3px'})`,
          transition: 'opacity 0.4s ease, transform 0.4s ease',
        }}
      />

      {/* File card */}
      <motion.div
        animate={{ y: hovered ? -8 : 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        className="relative overflow-hidden rounded-[3px] flex-1 flex flex-col"
        style={{
          border: `1px solid ${hovered ? 'color-mix(in srgb, var(--color-accent-primary) 22%, transparent)' : 'color-mix(in srgb, var(--color-page-foreground) 9%, transparent)'}`,
          background: hovered
            ? 'color-mix(in srgb, var(--color-accent-primary) 3.5%, color-mix(in srgb, var(--color-page-background) 82%, transparent))'
            : 'color-mix(in srgb, var(--color-page-background) 82%, transparent)',
          boxShadow: hovered
            ? '0 18px 40px -8px color-mix(in srgb, var(--color-accent-primary) 15%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-accent-primary) 12%, transparent)'
            : '0 1px 0 color-mix(in srgb, var(--color-page-foreground) 5%, transparent)',
          transition: 'background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',
        }}
      >
        {/* File tab accent strip */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              'linear-gradient(90deg, var(--color-accent-primary) 0%, color-mix(in srgb, var(--color-accent-primary) 28%, transparent) 52%, transparent 100%)',
            opacity: hovered ? 0.72 : 0.18,
            transition: 'opacity 0.4s ease',
          }}
        />


        {/* Giant Watermark Number */}
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none opacity-20">
           <span
              className="select-none leading-none text-transparent"
              style={{
                fontFamily: 'var(--font-wide)',
                fontSize: 'clamp(12rem, 20vw, 22rem)',
                WebkitTextStroke: `1px color-mix(in srgb, var(--color-accent-primary) ${hovered ? 25 : 15}%, transparent)`,
                filter: hovered ? 'drop-shadow(0 0 20px color-mix(in srgb, var(--color-accent-primary) 15%, transparent))' : 'none',
                transition: '-webkit-text-stroke 0.4s ease, filter 0.5s ease',
              }}
           >
             {cert.num}
           </span>
        </div>

        <div className="relative z-10 flex-1 grid gap-5 p-6 md:grid-cols-[minmax(0,1fr)_11.5rem] md:gap-6 md:p-7">

          {/* ── Main content ── */}
          <div className="min-w-0 flex flex-col justify-between gap-4">
            <div className="space-y-2.5">
              <div
                className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[8px] font-mono uppercase tracking-[0.28em]"
                style={{ color: 'color-mix(in srgb, var(--color-page-foreground) 28%, transparent)' }}
              >
                <span
                  className="text-[11px] tracking-[0.18em]"
                  style={{ color: 'color-mix(in srgb, var(--color-accent-primary) 74%, transparent)' }}
                >
                  {cert.issuer}
                </span>
                <span
                  className="h-[3px] w-[3px] rounded-full"
                  style={{ background: 'color-mix(in srgb, var(--color-page-foreground) 18%, transparent)' }}
                />
                <span>{cert.month}</span>
              </div>

              <h3
                className="max-w-3xl text-[1.25rem] font-bold leading-[1.03] md:text-[1.7rem]"
                style={{
                  color: `color-mix(in srgb, var(--color-page-foreground) ${hovered ? 96 : 78}%, transparent)`,
                  transition: 'color 0.3s ease',
                }}
              >
                {cert.title}
              </h3>

              <p
                className="max-w-xl text-[0.72rem] leading-[1.6] font-light"
                style={{
                  color: `color-mix(in srgb, var(--color-page-foreground) ${hovered ? 45 : 32}%, transparent)`,
                  transition: 'color 0.35s ease',
                }}
              >
                {cert.desc}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {cert.skills.map(s => (
                <span
                  key={s}
                  className="rounded-full border px-2.5 py-[0.35rem] text-[7px] font-mono uppercase tracking-[0.22em]"
                  style={{
                    borderColor: `color-mix(in srgb, var(--color-accent-primary) ${hovered ? 22 : 11}%, transparent)`,
                    color: `color-mix(in srgb, var(--color-accent-primary) ${hovered ? 72 : 55}%, transparent)`,
                    transition: 'border-color 0.3s ease, color 0.3s ease',
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right column: barcode + link ── */}
          <div
            className="flex flex-col gap-3 border-t pt-3 md:border-l md:border-t-0 md:pl-5 md:pt-0"
            style={{
              borderColor: `color-mix(in srgb, var(--color-page-foreground) ${hovered ? 10 : 6}%, transparent)`,
              transition: 'border-color 0.35s ease',
            }}
          >
            <div>
              <span
                className="mb-2 block text-[7px] font-mono uppercase tracking-[0.28em]"
                style={{ color: 'color-mix(in srgb, var(--color-page-foreground) 24%, transparent)' }}
              >
                credential id
              </span>
              <Barcode id={cert.id} active={hovered} />
            </div>

            <div className="mt-auto">
              {hasCredential ? (
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[8px] font-mono uppercase tracking-[0.24em]"
                  style={{
                    color: hovered
                      ? 'color-mix(in srgb, var(--color-accent-primary) 75%, transparent)'
                      : 'color-mix(in srgb, var(--color-page-foreground) 42%, transparent)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  <span>view credential</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span
                  className="text-[8px] font-mono uppercase tracking-[0.24em]"
                  style={{ color: 'color-mix(in srgb, var(--color-page-foreground) 26%, transparent)' }}
                >
                  private archive entry
                </span>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

export default function CertificationsSection() {
  return (
    <section id="certifications" className="relative pt-16 pb-6 px-6 md:px-10 overflow-hidden">
      {/* ── Base ── */}
      <div className="absolute inset-0 bg-[var(--color-page-background)]" />

      {/* ── Dot grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.28]"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--color-accent-primary) 55%, transparent) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      />

      {/* ── Left tractor-feed strip ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 hidden md:flex overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 52%, black 82%, transparent 100%)',
        }}
      >
        {/* Strip + punched holes */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--color-accent-primary) 5%, var(--color-page-background))',
            backgroundImage: `radial-gradient(
              circle 5.5px at center,
              var(--color-page-background)   0%,
              var(--color-page-background)  64%,
              color-mix(in srgb, var(--color-accent-primary) 35%, transparent) 71%,
              transparent 78%
            )`,
            backgroundSize: '32px 24px',
            backgroundPosition: '0 4px',
            borderRight:
              '1px dashed color-mix(in srgb, var(--color-accent-primary) 22%, transparent)',
          }}
        />
        {/* Vertical label */}
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none font-mono"
          style={{
            writingMode: 'vertical-rl',
            fontSize: '5px',
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color:
              'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
            whiteSpace: 'nowrap',
          }}
        >
          ·ARCHIVE·PRINT·ARCHIVE·PRINT·ARCHIVE·PRINT·ARCHIVE·
        </span>
      </div>

      {/* ── Right tractor-feed strip ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 hidden md:flex overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 52%, black 82%, transparent 100%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor:
              'color-mix(in srgb, var(--color-accent-primary) 5%, var(--color-page-background))',
            backgroundImage: `radial-gradient(
              circle 5.5px at center,
              var(--color-page-background)   0%,
              var(--color-page-background)  64%,
              color-mix(in srgb, var(--color-accent-primary) 35%, transparent) 71%,
              transparent 78%
            )`,
            backgroundSize: '32px 24px',
            backgroundPosition: '0 4px',
            borderLeft:
              '1px dashed color-mix(in srgb, var(--color-accent-primary) 22%, transparent)',
          }}
        />
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none font-mono"
          style={{
            writingMode: 'vertical-rl',
            fontSize: '5px',
            letterSpacing: '0.55em',
            textTransform: 'uppercase',
            color:
              'color-mix(in srgb, var(--color-accent-primary) 20%, transparent)',
            whiteSpace: 'nowrap',
          }}
        >
          ·ARCHIVE·PRINT·ARCHIVE·PRINT·ARCHIVE·PRINT·ARCHIVE·
        </span>
      </div>

      {/* ── Left accent line ── */}
      <div className="pointer-events-none absolute bottom-10 left-[max(1.5rem,5vw)] top-20 hidden w-px bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--color-accent-primary)_22%,transparent)] to-transparent xl:block" />

      <div className="mx-auto max-w-[1420px] relative z-10">

        {/* ── Section header ── */}
        <div className="mb-10 flex flex-row flex-wrap items-center gap-4 md:gap-6 relative group/header">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none overflow-hidden opacity-[0.12] dark:opacity-[0.02] transition-opacity duration-1000 group-hover/header:opacity-[0.18] dark:group-hover/header:opacity-[0.04]">
            <span className="text-[5.5rem] md:text-[8rem] font-black tracking-tighter uppercase whitespace-nowrap text-[var(--color-accent-primary)] block text-right leading-none">
              Archives
            </span>
          </div>
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-gradient-to-l from-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] to-transparent pointer-events-none" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-bold tracking-wide"
          >
            Technical{' '}
            <span style={{ color: 'color-mix(in srgb, var(--color-page-foreground) 40%, transparent)' }}>
              Archives
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="h-[1px] w-8 md:w-16 bg-[var(--color-accent-primary)] hidden md:block" />
            <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--color-accent-primary)] font-bold cursor-default">
              <ScrambleText text="06 // ARCHIVE_REGISTRY" delay={100} duration={1200} hoverScrambleDuration={400} />
            </span>
          </motion.div>
        </div>

        {/* ── Archive strip ── */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 grid gap-4 border-y py-4 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center"
          style={{ borderColor: 'color-mix(in srgb, var(--color-page-foreground) 7%, transparent)' }}
        >
          <div className="flex items-center gap-2 select-none">
            <span
              className="text-[8.5px] font-mono tracking-wider"
              style={{ color: 'color-mix(in srgb, var(--color-page-foreground) 22%, transparent)' }}
            >
              ziad.said@portfolio:~$
            </span>
            <span
              className="text-[8.5px] font-mono tracking-wider"
              style={{ color: 'color-mix(in srgb, var(--color-accent-primary) 38%, transparent)' }}
            >
              verify --credentials --all
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 1.1, ease: 'linear' }}
              className="inline-block h-[11px] w-[5px]"
              style={{ background: 'color-mix(in srgb, var(--color-accent-primary) 35%, transparent)' }}
            />
          </div>

          <div
            className="hidden h-px md:block"
            style={{
              background:
                'linear-gradient(to right, color-mix(in srgb, var(--color-accent-primary) 12%, transparent), color-mix(in srgb, var(--color-page-foreground) 8%, transparent), transparent)',
            }}
          />

          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[7px] font-mono uppercase tracking-[0.28em] md:justify-end"
            style={{ color: 'color-mix(in srgb, var(--color-page-foreground) 24%, transparent)' }}
          >
            <span>{CERTS.length.toString().padStart(2, '0')} records</span>
            <span>{PUBLIC_CERT_COUNT.toString().padStart(2, '0')} public links</span>
            <span>{SKILL_COUNT.toString().padStart(2, '0')} stack tags</span>
          </div>
        </motion.div>

        {/* ── Cert cards ── */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {CERTS.map((cert, i) => {
            const isLastOdd = CERTS.length % 2 !== 0 && i === CERTS.length - 1;
            return (
              <div key={cert.id} className={`flex flex-col ${isLastOdd ? 'lg:col-span-2' : ''}`}>
                <CertRow cert={cert} index={i} />
              </div>
            )
          })}
        </div>


      </div>

      
    </section>
  )
}
