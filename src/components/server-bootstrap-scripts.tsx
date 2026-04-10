'use client'

import { useServerInsertedHTML } from 'next/navigation'

export default function ServerBootstrapScripts({
  themeScript,
  scrollResetScript,
}: {
  themeScript: string
  scrollResetScript: string
}) {
  useServerInsertedHTML(() => (
    <>
      <script id="theme-initializer" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script id="scroll-restoration" dangerouslySetInnerHTML={{ __html: scrollResetScript }} />
    </>
  ))

  return null
}
