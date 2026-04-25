'use client'

import { useServerInsertedHTML } from 'next/navigation'

export default function ServerBootstrapScripts({
  themeScript,
  scrollResetScript,
  flovooWidgetScript,
}: {
  themeScript: string
  scrollResetScript: string
  flovooWidgetScript: string
}) {
  useServerInsertedHTML(() => (
    <>
      <script id="theme-initializer" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <script id="scroll-restoration" dangerouslySetInnerHTML={{ __html: scrollResetScript }} />
      <script id="flovoo-widget" dangerouslySetInnerHTML={{ __html: flovooWidgetScript }} />
    </>
  ))

  return null
}
