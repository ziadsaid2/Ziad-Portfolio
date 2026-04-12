import Image from 'next/image'

import { SplineScene } from '@/components/ui/spline'
import { SplineMouseTracker } from '@/components/ui/spline-mouse-tracker'
import { cn } from '@/lib/utils'
import { aiToolGroups, type SkillShowcaseGroup } from '@/lib/skills-showcase-content'
import { portfolioTerminalContent } from '@/lib/portfolio-terminal-content'
import * as motion from 'motion/react-client'
import { ScrambleText } from '@/components/ui/scramble-text'

const ROBOT_SCENE = 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode'

const skillIcons: Record<string, { slug?: string; color: string; url?: string; scale?: number }> = {
  'next.js': { slug: 'nextdotjs', color: '#ffffff' },
  'react': { slug: 'react', color: '#61DAFB' },
  'typescript': { slug: 'typescript', color: '#3178C6' },
  'tailwind css': { slug: 'tailwindcss', color: '#38B2AC' },
  'javascript': { slug: 'javascript', color: '#F7DF1E' },
  'ant design': { slug: 'antdesign', color: '#0170FE' },
  'tanstack react query': { slug: 'reactquery', color: '#FF4154' },
  'zod': { slug: 'zod', color: '#3E67B1' },
  
  'node.js': { slug: 'nodedotjs', color: '#339933' },
  'express': { slug: 'express', color: '#ffffff' },
  'nestjs': { slug: 'nestjs', color: '#E0234E' },
  'jwt': { slug: 'jsonwebtokens', color: '#D63AFF' },
  'fastify': { slug: 'fastify', color: '#ffffff' },
  'socket.io': { slug: 'socketdotio', color: '#ffffff' },
  'nats': { slug: 'natsdotio', color: '#27AAE1' },
  
  'mongodb': { slug: 'mongodb', color: '#47A248' },
  'mongoose': { slug: 'mongoose', color: '#880000' },
  'postgresql': { slug: 'postgresql', color: '#4169E1' },
  'redis': { slug: 'redis', color: '#FF4438' },
  'prisma': { slug: 'prisma', color: '#2D3748' },
  'typeorm': { slug: 'typeorm', color: '#FE0808' },
  'sequelize': { slug: 'sequelize', color: '#52B0E7' },
  
  'docker': { slug: 'docker', color: '#2496ED' },
  'aws s3': { url: '/icons/aws.png', color: '#FF9900' },
  'git': { slug: 'git', color: '#F05032' },
  'github': { slug: 'github', color: '#ffffff' },
  'postman': { slug: 'postman', color: '#FF6C37' },
  'datadog': { slug: 'datadog', color: '#632CA6' },
  
  'jira': { slug: 'jira', color: '#0052CC' },
  'confluence': { slug: 'confluence', color: '#0052CC' },
  'slack': { url: '/icons/slack.svg', color: '#4A154B', scale: 1.25 },

  'antigravity': { slug: 'googlegemini', color: '#9b30ff' },
  'cursor': { slug: 'cursor', color: '#00D1FF' },
  'chatgpt': { slug: 'perplexity', color: '#00A3BF' },
  'claude': { slug: 'anthropic', color: '#D97757' },
  'hugging face': { slug: 'huggingface', color: '#FFD21E' },
  'grok': { slug: 'x', color: '#ffffff' },
  'codex': { slug: 'probot', color: '#ffffff' },
  'github copilot': { slug: 'githubcopilot', color: '#24292E' },
  'langchain': { slug: 'langchain', color: '#1C3C3C' },
  'google ai studio': { slug: 'google', color: '#4285F4' },
  'figma': { slug: 'figma', color: '#F24E1E' },
  'spline': { slug: 'blender', color: '#F5792A' },
  'vercel': { slug: 'vercel', color: '#000000' },
  'v0': { slug: 'vercel', color: '#000000' },
  'replicate': { slug: 'replicate', color: '#000000' },
  'pinecone': { slug: 'mongodb', color: '#47A248' },
  'google stitch': { slug: 'google', color: '#EA4335' },
  'magic ui': { slug: 'framer', color: '#0055FF' },
  '21st.dev': { slug: 'react', color: '#61DAFB' },
  'dall-e': { slug: 'framer', color: '#0055FF' },
  'speckit': { slug: 'googledrive', color: '#4285F4' },
  'mcp': { slug: 'github', color: '#ffffff' },

  'rest apis': { slug: 'postman', color: '#FF6C37' },
  'sql': { slug: 'postgresql', color: '#4169E1' },
  'databases': { slug: 'mongodb', color: '#47A248' },
  'design systems': { slug: 'figma', color: '#F24E1E' },
  'performance': { slug: 'lighthouse', color: '#F44336' },
  'opencode': { slug: 'git', color: '#F05032' },
  'gemini': { slug: 'googlegemini', color: '#8E24AA' },
}

function getSkillData(name: string) {
  const normalized = name.toLowerCase()
  return skillIcons[normalized] || { slug: 'codeigniter', color: '#A0AEC0' }
}

function SkillCapsule({ item, index }: { item: string; index: number }) {
  const data = getSkillData(item)
  const hex = (data.color || '#ffffff').replace('#', '')
  
  const iconUrl = data.url || `https://cdn.simpleicons.org/${data.slug}/${hex}`
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex items-center gap-2 bg-[color-mix(in_srgb,var(--color-page-foreground)_2%,transparent)] border border-[color-mix(in_srgb,var(--color-page-foreground)_6%,transparent)] px-2.5 py-1.5 transition-all duration-300 hover:bg-[color-mix(in_srgb,var(--color-page-foreground)_5%,transparent)] hover:border-[color-mix(in_srgb,var(--color-page-foreground)_15%,transparent)] hover:-translate-y-0.5"
    >
      <Image
        src={iconUrl}
        alt={`${item} logo`}
        width={14}
        height={14}
        unoptimized
        className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-all duration-300"
        style={{ transform: `scale(${data.scale || 1})` }}
      />
      <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-tight uppercase text-[color-mix(in_srgb,var(--color-page-foreground)_60%,transparent)] group-hover:text-[var(--color-page-foreground)] transition-colors">
        {item}
      </span>
      
      {/* Hover Glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300 pointer-events-none"
        style={{ backgroundColor: data.color }}
      />
    </motion.div>
  )
}








function SkillColumn({
  groups,
  align,
}: {
  groups: SkillShowcaseGroup[]
  align: 'left' | 'right'
}) {
  const isRight = align === 'right'

  return (
    <div className={cn('flex flex-col gap-3.5 xl:gap-4 w-full', isRight && 'xl:items-end')}>
      {groups.map((group, groupIdx) => {
        let capsuleIndex = 0
        return (
          <div 
            key={group.title} 
            className={cn(
              "flex flex-col gap-2", 
              "xl:min-h-[118px] 2xl:min-h-[126px]", // Tightly hugs the largest group (Frontend) to minimize empty space
              isRight && "items-end"
            )}
          >
            <div className={cn("flex items-center gap-2 mb-0.5", isRight && "flex-row-reverse")}>
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] font-black text-[var(--color-accent-primary)] leading-none">
                0{groupIdx + 1}
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)] font-bold">
                {group.title}
              </span>
              <div className="h-[1px] w-4 bg-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]" />
            </div>

            <div className={cn("flex flex-wrap gap-1.5 sm:gap-2", isRight && "justify-end")}>
              {group.items.map((item) => {
                const idx = capsuleIndex++
                return <SkillCapsule key={item} item={item} index={idx} />
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SkillsBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]">
      {/* High-Fidelity Dot Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.45] dark:opacity-[0.2]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, var(--color-page-foreground) 1.5px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Subdued Ambient Occlusion (Depth mapping behind columns) */}
      <div className="absolute left-[-10%] top-1/4 w-[600px] h-[600px] bg-[color-mix(in_srgb,var(--color-accent-primary)_2.5%,transparent)] blur-[120px] rounded-full" />
      <div className="absolute right-[-10%] bottom-1/4 w-[500px] h-[500px] bg-[color-mix(in_srgb,var(--color-accent-tertiary)_2.5%,transparent)] blur-[120px] rounded-full" />
    </div>
  )
}

export default function SkillsSection() {
  const technicalGroups = portfolioTerminalContent.skillGroups.map((group) => {
    return {
      title: group.title,
      note: '',
      items: group.items.map((item) => item.name),
    }
  })



  return (
    <section 
      id="skills" 
      className="relative w-full py-16 px-6 md:px-10 overflow-hidden bg-[var(--color-page-background)]"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0, margin: "800px 0px" }}
        transition={{ duration: 1 }}
      >
        <SkillsBackground />
      </motion.div>

      
      {/* Soft gradient from top to erase any sharp background color discrepancies */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[var(--color-page-background)] to-transparent z-0 pointer-events-none" />

      <SplineMouseTracker className="mx-auto max-w-[1420px] relative z-10">
        {/* Section Header */}
        <div className="mb-10 flex flex-row flex-wrap items-center gap-4 md:gap-6 relative group/header">
          {/* Corner Accents for Title Area */}
          <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] rounded-tl-lg pointer-events-none" />
          <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-gradient-to-l from-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] to-transparent pointer-events-none" />
          
          {/* Large Background Watermark (Ghost Text) - Compact & Black Style */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none overflow-hidden opacity-[0.12] dark:opacity-[0.03] transition-opacity duration-1000 group-hover/header:opacity-[0.18] dark:group-hover/header:opacity-[0.05]">
            <span className="text-[5.5rem] md:text-[8rem] font-black tracking-tighter uppercase whitespace-nowrap text-[var(--color-accent-primary)] block text-right leading-none">
              Skills
            </span>
          </div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl md:text-5xl font-bold tracking-wide"
          >
            Skills <span className="text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)]">& Tools</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-3 shrink-0"
          >
            <div className="h-[1px] w-8 md:w-16 bg-[var(--color-accent-primary)] hidden md:block" />
            <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--color-accent-primary)] font-bold cursor-default">
              <ScrambleText text="03 // I DON'T WORK ALONE" delay={100} duration={1200} hoverScrambleDuration={400} />
            </span>
          </motion.div>
        </div>

        {/* ── Dual-column labels flanking the robot ────────────────── */}
        <div className="relative">

          {/* The horizontal axis: Core Skills label — robot — AI Support label */}
          <div className="flex items-start justify-between gap-4 xl:gap-0">

            {/* ─── LEFT: Core Skills column ─── */}
            <div className="flex-1 max-w-[420px] xl:max-w-[440px] z-10 pt-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-5"
              >
                <div className="w-1.5 h-1.5 bg-[var(--color-accent-primary)] rounded-full" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color-mix(in_srgb,var(--color-page-foreground)_90%,transparent)] font-bold">
                  Core Skills
                </h3>
                <div className="h-[1px] flex-1 bg-[color-mix(in_srgb,var(--color-page-foreground)_35%,transparent)]" />
              </motion.div>

              <SkillColumn groups={technicalGroups} align="left" />
            </div>

            {/* ─── CENTER: Robot ─── */}
            <div className="hidden xl:flex flex-col items-center justify-start shrink-0 w-[340px] 2xl:w-[400px] relative">
              {/* Robot container */}
              <div className="relative w-full min-h-[30rem] 2xl:min-h-[34rem] flex items-center justify-center">
                
                {/* HUD Elements around robot to fill space */}
                <div className="absolute inset-0 z-10 pointer-events-none select-none">
                  {/* Animated HUD Rings */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] w-[18rem] h-[18rem] 2xl:w-[22rem] 2xl:h-[22rem] border border-dashed border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] rounded-full opacity-40"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] w-[15rem] h-[15rem] 2xl:w-[19rem] 2xl:h-[19rem] border border-[color-mix(in_srgb,var(--color-accent-primary)_8%,transparent)] rounded-full opacity-20"
                  />

                  {/* Corner Brackets */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[52%] w-[12rem] h-[15rem] 2xl:w-[14rem] 2xl:h-[18rem]">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[var(--color-accent-primary)]/40" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[var(--color-accent-primary)]/40" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[var(--color-accent-primary)]/40" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[var(--color-accent-primary)]/40" />
                  </div>

                  {/* Dynamic Technical Labels */}
                  <div className="absolute bottom-4 left-0 flex flex-col gap-1 font-mono text-[7px] uppercase tracking-widest text-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1 h-1 bg-[var(--color-accent-primary)]" 
                      />
                      <span>System: Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-[color-mix(in_srgb,var(--color-page-foreground)_15%,transparent)]" />
                      <span>Sync: 98.4%</span>
                    </div>
                  </div>

                  <div className="absolute top-8 right-0 flex flex-col items-end gap-1 font-mono text-[7px] uppercase tracking-widest text-[color-mix(in_srgb,var(--color-page-foreground)_30%,transparent)]">
                    <span className="text-[var(--color-accent-primary)]/60">Target: Locked</span>
                    <span className="opacity-40">Azimuth: 142.5°</span>
                  </div>

                  {/* Floating Data Bits */}
                  <div className="absolute top-1/4 left-0 -translate-x-2 opacity-30 font-mono text-[6px] text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)] rotate-90 origin-left">
                    0x4F 0x2A 0x8D 0x11
                  </div>
                </div>

                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-accent-primary)_6%,transparent)] blur-2xl 2xl:h-[24rem] 2xl:w-[24rem]" />
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[17rem] w-[17rem] -translate-x-1/2 -translate-y-[50%] rounded-full border border-[color-mix(in_srgb,var(--color-page-foreground)_7%,transparent)] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-page-background)_66%,transparent),transparent_74%)] 2xl:h-[21rem] 2xl:w-[21rem]" />
                
                <div aria-hidden="true" className="absolute inset-0" data-cursor="interactive">
                  <SplineScene
                    scene={ROBOT_SCENE}
                    className="select-none scale-[1.05] translate-y-[2%] opacity-92 [mask-image:radial-gradient(closest-side,black_0%,black_75%,transparent_100%)]"
                  />
                </div>
              </div>
            </div>

            {/* ─── RIGHT: AI Support column ─── */}
            <div className="flex-1 max-w-[420px] xl:max-w-[440px] z-10 pt-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 mb-5 flex-row-reverse"
              >
                <div className="w-1.5 h-1.5 bg-[var(--color-accent-primary)] rounded-full" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color-mix(in_srgb,var(--color-page-foreground)_90%,transparent)] font-bold">
                  AI Support
                </h3>
                <div className="h-[1px] flex-1 bg-[color-mix(in_srgb,var(--color-page-foreground)_35%,transparent)]" />
              </motion.div>

              <SkillColumn groups={aiToolGroups} align="right" />
            </div>
          </div>

          {/* ─── Mobile/Tablet Robot (below columns on smaller screens) ─── */}
          <div className="xl:hidden relative mx-auto flex min-h-[24rem] w-full max-w-[20rem] flex-col items-center justify-center mt-6 sm:min-h-[28rem] sm:max-w-[24rem]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[18rem] w-[18rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color-mix(in_srgb,var(--color-accent-primary)_6%,transparent)] blur-2xl sm:h-[22rem] sm:w-[22rem]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-[50%] rounded-full border border-[color-mix(in_srgb,var(--color-page-foreground)_7%,transparent)] bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--color-page-background)_66%,transparent),transparent_74%)] sm:h-[19rem] sm:w-[19rem]" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[12rem] w-[12rem] -translate-x-1/2 -translate-y-[43%] rounded-full bg-[color-mix(in_srgb,var(--color-accent-tertiary)_7%,transparent)] blur-2xl sm:h-[15rem] sm:w-[15rem]" />

            <div aria-hidden="true" className="absolute inset-0 pointer-events-none" data-cursor="interactive">
              <SplineScene
                scene={ROBOT_SCENE}
                className="select-none scale-[1.14] translate-y-[3%] opacity-92 [mask-image:radial-gradient(closest-side,black_0%,black_75%,transparent_100%)]"
              />
            </div>
          </div>

        </div>

      </SplineMouseTracker>
    </section>
  )
}
  
