export type SkillShowcaseGroup = {
  title: string
  note: string
  items: string[]
}

export const skillsShowcaseCopy = {
  label: '03 // Skills',
  title: 'Skills & Tools',
  kicker: 'How I Work',
  description:
    'The skills at the center of my workflow, plus the AI tools I use to move faster, test ideas, and support the work without replacing craft or judgment.',
} as const

export const aiToolGroups: SkillShowcaseGroup[] = [
  {
    title: 'Agentic Strategy',
    note: 'Generative and agentic tools that support coding, research, and technical strategy.',
    items: ['Antigravity', 'Cursor', 'ChatGPT', 'Claude', 'Hugging Face', 'Grok'],
  },
  {
    title: 'Code Intelligence',
    note: 'Helper tools and protocols for faster build and test cycles.',
    items: ['Codex', 'GitHub Copilot', 'MCP', 'LangChain', 'Speckit'],
  },
  {
    title: 'Deployment Lab',
    note: 'Platform solutions for rapid product deployment and AI model orchestration.',
    items: ['Google AI Studio', 'Vercel', 'v0', 'Replicate', 'Pinecone'],
  },
  {
    title: 'Visual Synthesis',
    note: 'Visual tools and component libraries for building high-fidelity interfaces.',
    items: ['Figma', 'Spline', 'Magic UI', '21st.dev', 'DALL-E'],
  },
]

export const experienceShowcaseCopy = {
  label: '04 // Experience',
  title: 'Experience',
  description:
    'The workflow above only matters if it survives real delivery. This is where taste, engineering, and systems thinking turned into shipped work.',
} as const
