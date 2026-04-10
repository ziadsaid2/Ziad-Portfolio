'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'

import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

import { portfolioTerminalCommands } from '@/lib/portfolio-terminal-commands'

type TerminalHistoryEntry = {
  command: string
  output: string | React.ReactNode
}

type TerminalLink = {
  label: string
  value: string
  href?: string
}

type TerminalProject = {
  name: string
  techStack: string[]
  summary: string
  highlight?: string
  links?: TerminalLink[]
}

type TerminalSkill = {
  name: string
  level: number
}

type TerminalSkillGroup = {
  title: string
  items: TerminalSkill[]
}

type TerminalExperienceItem = {
  period: string
  startDate?: string // ISO format YYYY-MM-DD
  role: string
  company: string
  location: string
  bullets: string[]
  technologies?: string[]
  roles?: { title: string; period: string; bullets?: string[]; startDate?: string }[]
}

type TerminalEducation = {
  degree?: string
  institution?: string
  period?: string
  details?: string[]
  certifications?: string[]
  additionalLearning?: string[]
}

type TerminalProfile = {
  name: string
  role: string
  location: string
  status: string
  bio: string
}

type TerminalMeta = {
  user: string
  host: string
  path?: string
  title: string
  statusLabel?: string
  welcomeCommand?: string
  footerHintLeft?: string
  footerHintRight?: string
}

export type PortfolioTerminalContent = {
  profile: TerminalProfile
  projects: TerminalProject[]
  skillGroups: TerminalSkillGroup[]
  experience: TerminalExperienceItem[]
  education: TerminalEducation
  contacts: TerminalLink[]
  terminal: TerminalMeta
}

export type PortfolioTerminalHandle = {
  runCommand: (command: string) => void
}

const TYPING_HINTS = portfolioTerminalCommands
  .map((item) => item.command)
  .filter((command) => command !== 'clear')

const DEFAULT_BANNER = String.raw`
████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗
╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║
   ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║
   ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║
   ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g
const EMAIL_SPLIT_REGEX = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g
const URL_MATCH_REGEX = /^https?:\/\/[^\s]+$/
const EMAIL_MATCH_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function clampLevel(level: number) {
  return Math.max(0, Math.min(100, Math.round(level)))
}

function buildSkillBar(level: number) {
  const normalizedLevel = clampLevel(level)
  const totalBlocks = 20
  const filledBlocks = Math.round((normalizedLevel / 100) * totalBlocks)

  return `${'█'.repeat(filledBlocks)}${' '.repeat(totalBlocks - filledBlocks)} ${normalizedLevel}%`
}

function buildHelpOutput() {
  const commandColumnWidth = Math.max(...portfolioTerminalCommands.map((item) => item.command.length)) + 2

  return `
[AVAILABLE_COMMANDS]

${portfolioTerminalCommands
  .map((item) => `${item.command.padEnd(commandColumnWidth)} ${item.helpText}`)
  .join('\n')}
  `
}

function buildAboutOutput(profile: TerminalProfile) {
  return `
Name: ${profile.name}
Role: ${profile.role}
Location: ${profile.location}
Status: ${profile.status}

Bio: ${profile.bio}
  `
}

function buildProjectsOutput(projects: TerminalProject[]) {
  if (projects.length === 0) {
    return `
[SELECTED_WORK]

Add your projects in src/lib/portfolio-terminal-content.ts
    `
  }

  return `
[SELECTED_WORK]

${projects
    .map((project, index) => {
      const projectLines = [
        `${index + 1}. [PROJ] ${project.name}`,
        `   Tech Stack: ${project.techStack.join(', ')}`,
        `   Summary: ${project.summary}`,
      ]

      if (project.highlight) {
        projectLines.push(`   Highlight: ${project.highlight}`)
      }

      for (const link of project.links ?? []) {
        const isGithub = link.label.toLowerCase().includes('github')
        const icon = isGithub ? '>>' : '->'
        projectLines.push(`   ${icon} ${link.label}: ${link.value}`)
      }

      return projectLines.join('\n')
    })
    .join('\n\n')}
  `
}

function buildSkillsOutput(skillGroups: TerminalSkillGroup[]) {
  if (skillGroups.length === 0) {
    return `
[TECHNICAL_SKILLS]

Add your skills in src/lib/portfolio-terminal-content.ts
    `
  }

  return `
[TECHNICAL_SKILLS]

${skillGroups
    .map(
      (group) => `${group.title}:
${group.items.map((skill) => `  ${skill.name.padEnd(20)} ${buildSkillBar(skill.level)}`).join('\n')}`,
    )
    .join('\n\n')}
  `
}

function buildExperienceOutput(experience: TerminalExperienceItem[]) {
  if (experience.length === 0) {
    return `
[EXPERIENCE]

Add your experience in src/lib/portfolio-terminal-content.ts
    `
  }

  return `
[EXPERIENCE]

${experience
    .map((item) => {
      const lines: string[] = []
      if (item.roles && item.roles.length > 0) {
        lines.push(`${item.company}, ${item.location} | ${item.period}`)
        item.roles.forEach(r => lines.push(`  * ${r.title} | ${r.period}`))
      } else {
        lines.push(`${item.period} | ${item.role}`)
        lines.push(`${item.company}, ${item.location}`)
      }
      
      lines.push(...item.bullets.map((bullet) => `- ${bullet}`))

      if (item.technologies?.length) {
        lines.push(`Technologies: ${item.technologies.join(', ')}`)
      }

      return lines.join('\n')
    })
    .join('\n\n')}
  `
}

function buildEducationOutput(education: TerminalEducation) {
  const lines: string[] = ['[EDUCATION_AND_LEARNING]', '']

  if (education.degree && education.institution) {
    lines.push(education.degree)
    lines.push(`${education.institution}${education.period ? ` (${education.period})` : ''}`)
  } else {
    lines.push('Add your degree or training details in src/lib/portfolio-terminal-content.ts')
  }

  if (education.details?.length) {
    lines.push(...education.details.map((detail) => `- ${detail}`))
  }

  if (education.certifications?.length) {
    lines.push('', 'Certifications:')
    lines.push(...education.certifications.map((certification) => `- ${certification}`))
  }

  if (education.additionalLearning?.length) {
    lines.push('', 'Additional Learning:')
    lines.push(...education.additionalLearning.map((item) => `- ${item}`))
  }

  return `
${lines.join('\n')}
  `
}

function buildContactOutput(contacts: TerminalLink[]) {
  if (contacts.length === 0) {
    return `
[CONTACT]

Add your contact links in src/lib/portfolio-terminal-content.ts
    `
  }

  return (
    <div className="space-y-4 py-2">
      <div className="text-[var(--color-accent-primary)] font-bold tracking-wider">[CONTACT_CHANNELS]</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
        {contacts.map((contact) => {
          const isGithub = contact.label.toLowerCase().includes('github')
          const isLinkedin = contact.label.toLowerCase().includes('linkedin')
          const isWhatsapp = contact.label.toLowerCase().includes('whatsapp')
          const isEmail = contact.label.toLowerCase().includes('email')

          return (
            <a
              key={contact.label}
              href={contact.href || (isEmail ? `mailto:${contact.value}` : contact.value)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col gap-1 rounded-md border border-[var(--color-accent-primary)]/10 bg-[var(--color-accent-primary)]/5 p-3 transition-all hover:bg-[var(--color-accent-primary)]/10 hover:border-[var(--color-accent-primary)]/30",
                isWhatsapp && "border-[#25D366]/20 bg-[#25D366]/5 hover:bg-[#25D366]/10 hover:border-[#25D366]/40",
                isLinkedin && "border-[#0077B5]/20 bg-[#0077B5]/5 hover:bg-[#0077B5]/10 hover:border-[#0077B5]/40"
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest opacity-60 group-hover:opacity-100",
                  isWhatsapp && "text-[#25D366]",
                  isLinkedin && "text-[#0077B5]",
                  (!isWhatsapp && !isLinkedin) && "text-[var(--color-accent-primary)]"
                )}>
                  {contact.label}
                </span>
                <ExternalLink className="h-2.5 w-2.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className={cn(
                "text-sm font-medium break-all truncate",
                isWhatsapp && "text-[#25D366]",
                isLinkedin && "text-[#0077B5]",
                (!isWhatsapp && !isLinkedin) && "text-[var(--color-page-foreground)]"
              )}>
                {contact.value}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}

function buildWelcomeOutput(title: string) {
  return `
${DEFAULT_BANNER}
[SYSTEM INITIALIZED] - ${title}

Type help to see available commands.
  `
}

const PortfolioTerminal = forwardRef<PortfolioTerminalHandle, {
  content: PortfolioTerminalContent
}> (function PortfolioTerminal({
  content,
}, ref) {
  const promptLabel = `${content.terminal.user}@${content.terminal.host}:${content.terminal.path ?? '~'}$`
  const [history, setHistory] = useState<TerminalHistoryEntry[]>(() => [
    {
      command: content.terminal.welcomeCommand ?? '/welcome',
      output: buildWelcomeOutput(content.terminal.title),
    },
  ])
  const [currentCommand, setCurrentCommand] = useState('')
  const [hintIndex, setHintIndex] = useState(0)
  const [hintLength, setHintLength] = useState(0)
  const [isDeletingHint, setIsDeletingHint] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const historyIndexRef = useRef(-1)
  const viewportRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = useMemo<Record<string, () => (string | React.ReactNode)>>(
    () => ({
      help: () => buildHelpOutput(),
      about: () => buildAboutOutput(content.profile),
      projects: () => buildProjectsOutput(content.projects),
      skills: () => buildSkillsOutput(content.skillGroups),
      experience: () => buildExperienceOutput(content.experience),
      education: () => buildEducationOutput(content.education),
      contact: () => buildContactOutput(content.contacts),
      clear: () => {
        setHistory([])
        return ''
      },
    }),
    [content],
  )

  const previousCommands = history
    .map((entry) => entry.command)
    .filter((command) => command && !command.startsWith('/'))
  const activeHint = TYPING_HINTS[hintIndex] ?? TYPING_HINTS[0] ?? 'help'
  const visibleHint = prefersReducedMotion ? activeHint : activeHint.slice(0, hintLength)

  const runCommand = useCallback((rawCommand: string) => {
    const normalizedCommand = rawCommand.toLocaleLowerCase()

    if (!normalizedCommand) {
      return
    }

    const commandFn = commands[normalizedCommand]
    const output = commandFn
      ? commandFn()
      : `Command not found: ${normalizedCommand}
Type help to see available commands.`

    if (normalizedCommand !== 'clear') {
      setHistory((previousHistory) => [
        ...previousHistory,
        { command: rawCommand, output },
      ])
    }

    historyIndexRef.current = -1
    inputRef.current?.focus()
  }, [commands])

  useImperativeHandle(ref, () => ({
    runCommand: (command: string) => {
      setCurrentCommand('')
      runCommand(command)
    },
  }), [runCommand])

  const handleCommand = () => {
    const rawCommand = currentCommand.trim()

    if (!rawCommand) {
      return
    }

    runCommand(rawCommand)
    setCurrentCommand('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCommand()
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()

      const nextIndex = Math.min(historyIndexRef.current + 1, previousCommands.length - 1)
      historyIndexRef.current = nextIndex

      if (nextIndex >= 0) {
        setCurrentCommand(previousCommands[previousCommands.length - 1 - nextIndex] ?? '')
      }

      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()

      const nextIndex = Math.max(historyIndexRef.current - 1, -1)
      historyIndexRef.current = nextIndex
      setCurrentCommand(nextIndex === -1 ? '' : previousCommands[previousCommands.length - 1 - nextIndex] ?? '')
    }
  }

  useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: 'smooth',
    })
  }, [history])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const syncPreference = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }

    syncPreference()
    mediaQuery.addEventListener('change', syncPreference)

    return () => {
      mediaQuery.removeEventListener('change', syncPreference)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || TYPING_HINTS.length === 0) {
      return
    }

    const hintIsComplete = hintLength === activeHint.length
    const hintIsEmpty = hintLength === 0
    let timeoutMs = isDeletingHint ? 45 : 85

    if (hintIsComplete) {
      timeoutMs = 1100
    } else if (hintIsEmpty && isDeletingHint) {
      timeoutMs = 180
    }

    const timeoutId = window.setTimeout(() => {
      if (!isDeletingHint && !hintIsComplete) {
        setHintLength((currentLength) => currentLength + 1)
        return
      }

      if (!isDeletingHint && hintIsComplete) {
        setIsDeletingHint(true)
        return
      }

      if (isDeletingHint && !hintIsEmpty) {
        setHintLength((currentLength) => currentLength - 1)
        return
      }

      setIsDeletingHint(false)
      setHintIndex((currentIndex) => (currentIndex + 1) % TYPING_HINTS.length)
    }, timeoutMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeHint, hintLength, isDeletingHint, prefersReducedMotion])

  const renderRichText = (output: string) => {
    const urlParts = output.split(URL_SPLIT_REGEX)

    const parts = urlParts.flatMap((part) =>
      URL_MATCH_REGEX.test(part) ? [part] : part.split(EMAIL_SPLIT_REGEX),
    )

    return parts.map((part, index) => {
      if (URL_MATCH_REGEX.test(part)) {
        const isGithub = part.includes('github.com')
        const isLinkedin = part.includes('linkedin.com')
        const isWhatsapp = part.includes('wa.me')
        const isLive = part.toLowerCase().includes('vercel.app') || part.toLowerCase().includes('demo')
        
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-1.5 break-all rounded-sm px-1.5 py-0.5 transition-all outline-none",
              isGithub 
                ? "bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)]/20 shadow-[0_0_10px_color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)]" 
                : isLinkedin
                  ? "bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20 shadow-[0_0_10px_rgba(0,119,181,0.1)]"
                  : isWhatsapp
                    ? "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 shadow-[0_0_10px_rgba(37,211,102,0.1)]"
                    : isLive
                      ? "bg-[oklch(0.7_0.2_150)]/10 text-[oklch(0.7_0.2_150)] hover:bg-[oklch(0.7_0.2_150)]/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                      : "text-[var(--color-accent-primary)] hover:opacity-80"
            )}
          >
            {isGithub ? (
              <svg aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 6.9c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.21 2.46.11 2.72.64.72 1.03 1.63 1.03 2.75 0 3.95-2.33 4.81-4.56 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.5A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
              </svg>
            ) : isLinkedin ? (
              <svg aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56a2.03 2.03 0 1 0-4.06 0 2.03 2.03 0 0 0 4.06 0ZM20.44 13.02c0-3.46-1.85-5.07-4.32-5.07-1.99 0-2.88 1.1-3.38 1.87V8.5H9.36c.05.88 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92.27-.68.88-1.38 1.91-1.38 1.35 0 1.89 1.04 1.89 2.56V20h3.38v-6.98Z" />
              </svg>
            ) : isWhatsapp ? (
              <svg aria-hidden="true" className="h-3 w-3 sm:h-3.5 sm:w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04A9.96 9.96 0 0 0 3.4 16.96L2 22l5.17-1.35A9.96 9.96 0 1 0 12 2.04Zm0 18.1a8.08 8.08 0 0 1-4.12-1.13l-.3-.18-3.07.8.82-2.99-.2-.31a8.09 8.09 0 1 1 6.87 3.81Zm4.44-5.95c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.57 4.07 3.61.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            ) : <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5" />}
            <span className={cn(
              "underline decoration-dotted underline-offset-2",
              isGithub || isLive || isLinkedin || isWhatsapp ? "font-bold" : "font-normal"
            )}>
              {part.replace(/^https?:\/\/(www\.)?/, '')}
            </span>
          </a>
        )
      }

      if (EMAIL_MATCH_REGEX.test(part)) {
        return (
          <a
            key={`${part}-${index}`}
            href={`mailto:${part}`}
            className="inline-flex items-center gap-1.5 break-all text-[var(--color-accent-primary)] transition-opacity hover:opacity-80 hover:underline"
          >
            {part}
          </a>
        )
      }

      return <span key={`${part}-${index}`}>{part}</span>
    })
  }

  const renderOutput = (output: string | React.ReactNode) => {
    if (typeof output !== 'string') {
      return output
    }

    if (!output.includes(DEFAULT_BANNER)) {
      return renderRichText(output)
    }

    const outputWithoutBanner = output.replace(DEFAULT_BANNER, '').replace(/^\s+/, '')

    return (
      <>
        <div className="overflow-x-hidden pb-2 pt-1">
          <pre className="inline-block whitespace-pre text-[clamp(0.24rem,1.45vw,0.8rem)] leading-[0.92] text-[color-mix(in_srgb,var(--color-page-foreground)_78%,transparent)] sm:text-[clamp(0.34rem,1vw,0.86rem)]">
            {DEFAULT_BANNER}
          </pre>
        </div>

        {outputWithoutBanner ? renderRichText(outputWithoutBanner) : null}
      </>
    )
  }

  return (
    <div className="w-full font-mono text-[11px] leading-[1.55] text-[color-mix(in_srgb,var(--color-page-foreground)_80%,transparent)] sm:text-sm lg:text-base">
      <div className="overflow-hidden rounded-[var(--radius-panel)] border border-[color-mix(in_srgb,var(--color-accent-primary)_18%,var(--color-hero-line))] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-toggle-background)_90%,transparent)_0%,color-mix(in_srgb,var(--color-hero-background)_88%,transparent)_100%)] shadow-[0_1rem_2.5rem_-1.5rem_color-mix(in_srgb,var(--color-accent-primary)_40%,transparent)] backdrop-blur-[12px] transition-all duration-300">
        <div className="flex items-center gap-2 border-b border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] bg-transparent px-3 py-2.5 text-[10px] text-[color-mix(in_srgb,var(--color-page-foreground)_50%,transparent)] sm:px-4 sm:py-3 sm:text-xs">
          <div className="shrink-0 flex gap-1.5 opacity-60">
            <div className="h-3 w-3 rounded-full bg-[color-mix(in_srgb,var(--color-page-foreground)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]" />
            <div className="h-3 w-3 rounded-full bg-[color-mix(in_srgb,var(--color-page-foreground)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]" />
            <div className="h-3 w-3 rounded-full bg-[color-mix(in_srgb,var(--color-page-foreground)_20%,transparent)] border border-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]" />
          </div>
          <div className="min-w-0 flex-1 truncate text-center font-semibold tracking-[0.2em] text-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)] uppercase">
            {promptLabel} | {content.terminal.title}
          </div>
          <div className="shrink-0 text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent-primary)] sm:text-xs">
            {content.terminal.statusLabel ?? 'online'}
          </div>
        </div>

        <div
          ref={viewportRef}
          className="h-[20rem] cursor-text overflow-y-auto bg-transparent px-3 py-3 sm:h-[26rem] sm:px-5 sm:py-4 lg:h-[30rem]"
          onClick={() => inputRef.current?.focus()}
          role="presentation"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--color-accent-primary) transparent',
          }}
        >
          <div className="space-y-4">
            {history.map((entry, index) => (
              <div key={`${entry.command}-${index}`} className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <span className="break-all font-semibold text-[var(--color-accent-primary)]">{promptLabel}</span>
                  <span className="break-words text-[var(--color-page-foreground)]">{entry.command}</span>
                </div>
                <div className="break-words whitespace-pre-wrap pl-0 leading-relaxed text-[color-mix(in_srgb,var(--color-page-foreground)_80%,transparent)] sm:pl-6">
                  {renderOutput(entry.output)}
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-2">
              <span className="break-all font-semibold text-[var(--color-accent-primary)]">{promptLabel}</span>
              <div className="relative min-w-0 flex-1">
                {currentCommand.length === 0 ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden whitespace-nowrap text-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]"
                  >
                    {visibleHint}
                  </span>
                ) : null}

                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(event) => setCurrentCommand(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-w-0 w-full bg-transparent text-[var(--color-page-foreground)] outline-none caret-[var(--color-accent-primary)]"
                  spellCheck="false"
                  aria-label="Terminal command input"
                />
              </div>
              <span className="animate-pulse text-[var(--color-accent-primary)]">█</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-t border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] bg-transparent px-3 py-2.5 text-[10px] text-[color-mix(in_srgb,var(--color-page-foreground)_60%,transparent)] sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3 sm:text-xs">
          <span>{content.terminal.footerHintLeft ?? 'Type help for available commands'}</span>
          <span>{content.terminal.footerHintRight ?? 'Use clear to reset terminal'}</span>
        </div>
      </div>
    </div>
  )
})

export default PortfolioTerminal
