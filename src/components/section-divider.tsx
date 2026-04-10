export function SectionDivider() {
  return (
    <div className="relative w-full flex justify-center pointer-events-none bg-[var(--color-page-background)]">
      <div className="w-[80%] h-[1px] bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--color-page-foreground)_8%,transparent)] to-transparent" />
      <div className="absolute top-0 w-32 h-[1px] bg-[color-mix(in_srgb,var(--color-accent-primary)_20%,transparent)]" />
    </div>
  )
}
