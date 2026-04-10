import { portfolioTerminalContent } from '@/lib/portfolio-terminal-content'
import * as motion from 'motion/react-client'
import { ScrambleText } from '@/components/ui/scramble-text'
import { ExperienceBackground } from '@/sections/experience-background'

function calculateTenure(startDateStr?: string) {
  if (!startDateStr) return ''
  const start = new Date(startDateStr)
  const now = new Date()
  
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  
  if (months < 0) {
    years--
    months += 12
  }
  
  const parts = []
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`)
  if (parts.length === 0) parts.push('1 mo') // Minimum
  
  return parts.join(' ')
}

export default function ExperienceSection() {
  const experiences = portfolioTerminalContent.experience

  return (
    <section 
      id="experience" 
      className="relative w-full px-4 pt-12 pb-40 sm:px-6 lg:px-8 z-10"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0, margin: "1500px 0px" }}
        transition={{ duration: 1 }}
      >
        <ExperienceBackground />
      </motion.div>

      {/* Soft gradient to blend with previous section */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[var(--color-page-background)] to-transparent z-0 pointer-events-none" />


      <div className="mx-auto max-w-[1420px] relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12 lg:gap-16">
          {/* Left: Sticky Header */}
          <div className="relative w-full shrink-0">
            <div className="lg:sticky lg:top-56 xl:top-60 flex flex-col gap-6 relative group/header">
              {/* Corner Accents for Title Area */}
              <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] rounded-tl-lg pointer-events-none" />
              <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-gradient-to-l from-[color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] to-transparent pointer-events-none" />
              
              <div className="relative">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4 whitespace-nowrap"
                >
                  Experience
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="flex items-center gap-3 shrink-0"
                >
                  <div className="h-[1px] w-12 bg-[var(--color-accent-primary)] hidden sm:block" />
                  <span className="text-[10px] md:text-xs font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] text-[var(--color-accent-primary)] font-bold cursor-default">
                    <ScrambleText text="04 // TRACK RECORD" delay={100} duration={1200} hoverScrambleDuration={400} />
                  </span>
                </motion.div>
               </div>
             </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-20 lg:block bg-gradient-to-b from-transparent via-[color-mix(in_srgb,var(--color-page-background)_72%,transparent)] to-[var(--color-page-background)]" />
          </div>

          {/* Right: Scrollable Cards */}
          <div className="w-full">
            {/* Timeline Layout */}
            <div className="relative">
              {/* Main vertical timeline axis with flowing light effect */}
              <div className="absolute left-[1.125rem] md:left-[2.125rem] top-8 bottom-0 w-[1px] hidden sm:block">
                {/* Background static line */}
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-primary)] via-[color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)] to-transparent" />
                
                {/* Flowing Light Pulse */}
                <motion.div 
                  className="absolute top-0 left-[-1px] w-[3px] h-32 bg-gradient-to-b from-transparent via-[var(--color-accent-primary)] to-transparent opacity-40 blur-[1px]"
                  animate={{ 
                    top: ["0%", "100%"],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "linear",
                    times: [0, 0.5, 1]
                  }}
                />
              </div>

              <ol className="relative space-y-12 sm:space-y-16 sm:pl-[5.5rem] md:pl-[6.5rem]">
                {experiences.map((item, index) => (
                  <motion.li 
                    key={`${item.company}-${item.period}-${index}`} 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="relative group"
                  >
                    {/* Enhanced Timeline Axis Node - Perfectly centered on the vertical line */}
                    <div className="absolute left-[-4.375rem] top-8 -translate-x-1/2 hidden sm:flex items-center justify-center w-5 h-5 z-20">
                      {/* Outer Hex/Square Plate */}
                      <div className="absolute inset-0 border border-[var(--color-accent-primary)] bg-[var(--color-page-background)] rounded-sm group-hover:rotate-45 transition-transform duration-500 overflow-hidden">
                         {/* Subtle inner grid in node */}
                         <div className="absolute inset-0 opacity-20 [background-size:4px_4px] [background-image:radial-gradient(circle,var(--color-accent-primary)_0.5px,transparent_0.5px)]" />
                      </div>
                      
                      {/* Rotating Ring (Decorative) */}
                      <div className="absolute inset-[-4px] border-[0.5px] border-t-[var(--color-accent-primary)] border-r-transparent border-b-transparent border-l-transparent rounded-full opacity-0 group-hover:opacity-40 animate-spin" />
                      
                      {/* Inner Glowing Core */}
                      <div className="relative w-1.5 h-1.5 bg-[var(--color-accent-primary)] rounded-full group-hover:scale-150 transition-transform duration-500 shadow-[0_0_8px_var(--color-accent-primary)]" />
                      
                      {/* Static Aura on hover */}
                      <div className="absolute inset-0 bg-[var(--color-accent-primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-sm shadow-[0_0_8px_var(--color-accent-primary)]" />
                    </div>
                    
                    {/* Connecting lateral line to the node - Perfectly bridges the gap */}
                    <div className="absolute left-[-4.375rem] top-10 w-[4.375rem] h-[1px] bg-[color-mix(in_srgb,var(--color-accent-primary)_30%,transparent)] hidden sm:block group-hover:bg-[var(--color-accent-primary)] transition-colors duration-500" />

                    <article className="relative overflow-hidden group/article transition-transform duration-500 bg-[color-mix(in_srgb,var(--color-toggle-background)_50%,transparent)] border border-[color-mix(in_srgb,var(--color-accent-primary)_12%,var(--color-page-foreground)_10%)] backdrop-blur-xl px-6 py-7 sm:px-8 sm:py-8 shadow-[0_1rem_2.5rem_-1.5rem_color-mix(in_srgb,var(--color-accent-primary)_15%,transparent)] group-hover:border-[color-mix(in_srgb,var(--color-accent-primary)_35%,transparent)] group-hover:shadow-[0_1rem_3rem_-1.5rem_color-mix(in_srgb,var(--color-accent-primary)_35%,transparent)] rounded-[1rem]">
                      {/* Technical HUD Brackets */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[var(--color-accent-primary)]/40 group-hover/article:border-[var(--color-accent-primary)] transition-colors duration-500 rounded-tl-[0.5rem]" />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[var(--color-accent-primary)]/40 group-hover/article:border-[var(--color-accent-primary)] transition-colors duration-500 rounded-tr-[0.5rem]" />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[var(--color-accent-primary)]/40 group-hover/article:border-[var(--color-accent-primary)] transition-colors duration-500 rounded-bl-[0.5rem]" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[var(--color-accent-primary)]/40 group-hover/article:border-[var(--color-accent-primary)] transition-colors duration-500 rounded-br-[0.5rem]" />
                      
                      {/* Subtle inner grid mask */}
                      <div className="pointer-events-none absolute inset-0 opacity-[0.25] mix-blend-overlay group-hover/article:opacity-[0.4] transition-opacity duration-700 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--color-accent-primary)_50%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-accent-primary)_50%,transparent)_1px,transparent_1px)] [background-size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
                      
                      <div className="relative z-10 flex flex-col gap-8">
                        {/* Header Row: Company & Location */}
                        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between mb-2">
                          <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                {/* Company Name */}
                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-page-foreground)] leading-none">
                                  {item.company}
                                </h3>
                                
                                {/* Vertical Separator */}
                                <div className="h-8 w-[1px] bg-[color-mix(in_srgb,var(--color-page-foreground)_15%,transparent)] hidden md:block" />

                                <div className="flex items-center gap-2 px-3 py-1.5 bg-[color-mix(in_srgb,var(--color-accent-primary)_10%,transparent)] border border-[color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)] rounded-sm">
                                  <div className="relative flex items-center justify-center w-1.5 h-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-accent-primary)] opacity-40 animate-ping" />
                                    <span className="relative inline-flex rounded-full h-1 w-1 bg-[var(--color-accent-primary)]" />
                                  </div>
                                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-accent-primary)] font-bold">
                                    {item.period.split('·')[0].trim()}
                                  </span>
                                  <span className="text-[var(--color-accent-primary)] opacity-30 font-mono text-[10px] mx-1">{'//'}</span>
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent-primary)] opacity-70 font-semibold">
                                    {item.startDate ? calculateTenure(item.startDate) : (item.period.split('·')[1]?.trim() || '')}
                                  </span>
                                </div>
                              </div>

                            {/* Professional Role - Now accurately positioned as a sub-heading */}
                            {(!item.roles || item.roles.length === 0) && (
                              <div className="flex items-center gap-3">
                                <div className="h-0.5 w-4 bg-[var(--color-accent-primary)] opacity-40" />
                                <p className="text-lg font-semibold text-[color-mix(in_srgb,var(--color-page-foreground)_90%,transparent)] tracking-tight">
                                  {item.role}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Meta info (Location) */}
                          <div className="text-xs font-mono text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)] mt-1 md:mt-2 xl:text-right">
                             <div className="flex flex-col md:items-end">
                                <span className="uppercase tracking-[0.2em] text-[9px] opacity-60 mb-0.5">Deployment</span>
                                <span className="tracking-tight block font-medium group-hover/article:text-[color-mix(in_srgb,var(--color-page-foreground)_60%,transparent)] transition-colors">
                                  {item.location.split('·').map((part, idx, arr) => {
                                    const isRemote = part.trim().toLowerCase() === 'remote';
                                    return (
                                      <span key={idx} className={isRemote ? 'text-[var(--color-accent-primary)] font-bold' : ''}>
                                        {part.trim()}
                                        {idx < arr.length - 1 && <span className="text-[color-mix(in_srgb,var(--color-page-foreground)_20%,transparent)] mx-1.5">·</span>}
                                      </span>
                                    );
                                  })}
                                </span>
                             </div>
                          </div>
                        </div>

                        {/* Overall Company Summary Bullets */}
                        {item.bullets && item.bullets.length > 0 && (
                          <div className="space-y-4">
                            {item.bullets.map((bullet, i) => (
                              <div key={i} className="relative pl-6 text-[0.95rem] leading-relaxed text-[color-mix(in_srgb,var(--color-page-foreground)_85%,transparent)]">
                                <div className="absolute left-0 top-[0.65rem] w-1.5 h-[1px] bg-[var(--color-accent-primary)] group-hover/article:w-3 transition-all duration-300" />
                                <span>{bullet}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Career Progression Hierarchy (If Multiple Roles) */}
                        {item.roles && item.roles.length > 0 && (
                          <div className="flex flex-col gap-6 mt-4 relative pt-2">
                            {/* Refined static internal branch line */}
                            <div className="absolute left-[13px] top-[14px] bottom-0 w-[1px] hidden sm:block z-0">
                              <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-primary)] via-[color-mix(in_srgb,var(--color-accent-primary)_30%,transparent)] to-transparent opacity-40" />
                            </div>
                            
                            {item.roles.map((r, i) => (
                              <div key={i} className="relative z-10 pl-10">
                                {/* Refined Branch Node */}
                                <div className="absolute left-[8px] top-[22px] w-3 h-3 z-10 flex items-center justify-center">
                                  {/* Base Plate */}
                                  <div className="absolute inset-0 border border-[var(--color-accent-primary)] bg-[var(--color-page-background)] rounded-full group-hover/article:scale-110 transition-transform duration-300" />
                                  
                                  {/* Small Glowing Core */}
                                  <div className="relative w-1 h-1 bg-[var(--color-accent-primary)] rounded-full shadow-[0_0_5px_var(--color-accent-primary)] opacity-80" />
                                  
                                  {/* Static Aura on hover */}
                                  <div className="absolute inset-0 bg-[var(--color-accent-primary)] opacity-0 group-hover/article:opacity-20 transition-opacity duration-500 rounded-full shadow-[0_0_8px_var(--color-accent-primary)]" />
                                </div>
                                
                                {/* Role Card Banner */}
                                <div className="flex flex-col gap-1 w-full bg-[color-mix(in_srgb,var(--color-page-foreground)_2%,transparent)] border border-[color-mix(in_srgb,var(--color-page-foreground)_8%,transparent)] rounded-tl-sm rounded-tr-xl rounded-b-xl overflow-hidden hover:bg-[color-mix(in_srgb,var(--color-page-foreground)_4%,transparent)] transition-colors">
                                  <div className="flex justify-between items-center bg-[color-mix(in_srgb,var(--color-page-foreground)_4%,transparent)] px-5 py-3 border-b border-[color-mix(in_srgb,var(--color-page-foreground)_5%,transparent)]">
                                    <h4 className="font-bold text-[0.95rem] text-[color-mix(in_srgb,var(--color-page-foreground)_90%,transparent)]">{r.title}</h4>
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-[color-mix(in_srgb,var(--color-page-foreground)_50%,transparent)]">
                                      {r.startDate 
                                        ? `${r.period.split('·')[0].trim()} // ${calculateTenure(r.startDate)}`
                                        : r.period}
                                    </span>
                                  </div>
                                  
                                  {/* Specific bullets for this role */}
                                  {r.bullets && r.bullets.length > 0 && (
                                    <ul className="px-5 py-4 space-y-3">
                                      {r.bullets.map((b, bi) => (
                                        <li key={bi} className="text-[0.95rem] leading-relaxed text-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)] relative pl-4">
                                          <div className="absolute left-0 top-[0.6rem] w-[0.25rem] h-[0.25rem] bg-[var(--color-accent-primary)] opacity-60 rounded-sm" />
                                          {b}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Stack Footer */}
                        {item.technologies?.length ? (
                          <div className="pt-4 border-t border-[color-mix(in_srgb,var(--color-page-foreground)_5%,transparent)]">
                             <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--color-page-foreground)_40%,transparent)] mb-3">
                               Stack & Tech Used
                             </div>
                            <div className="flex flex-wrap gap-2">
                              {item.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className="font-mono bg-[color-mix(in_srgb,var(--color-page-background)_60%,transparent)] border border-[color-mix(in_srgb,var(--color-page-foreground)_15%,transparent)] text-[color-mix(in_srgb,var(--color-page-foreground)_75%,transparent)] px-2.5 py-1.5 text-[10px] uppercase tracking-wider group-hover/article:border-[color-mix(in_srgb,var(--color-accent-primary)_30%,transparent)] group-hover/article:text-[var(--color-page-foreground)] hover:-translate-y-0.5 transition-all duration-300"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
