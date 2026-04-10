import type { PortfolioTerminalContent } from '@/components/ui/interactive-portfolio-terminal-component'

import { profileContacts } from '@/lib/profile'

// Edit this object to change the terminal content without touching the component.
export const portfolioTerminalContent: PortfolioTerminalContent = {
  profile: {
    name: 'Ziad Said',
    role: 'Full Stack Developer',
    location: 'Egypt / Remote',
    status: 'Open to product, freelance, and collaboration work',
    bio: 'I build modern web experiences with a focus on interaction, clean systems, and polished frontend execution.',
  },
  projects: [
    {
      name: 'Restaurant Management System',
      techStack: ['React', 'NestJS', 'TypeScript', 'MongoDB', 'JWT'],
      summary: 'Full-stack restaurant management platform with separate frontend (React) and backend (NestJS) services connected to MongoDB.',
      highlight: 'JWT authentication, admin dashboard, menu management, shopping cart, table reservations, and real-time notifications system.',
      links: [
        { label: 'GitHub', value: 'https://github.com/ziadsaid2/restaurant-project', href: 'https://github.com/ziadsaid2/restaurant-project' },
      ],
    },
    {
      name: 'Course Registration System',
      techStack: ['Java', 'Swing', 'OOP'],
      summary: 'Desktop application for managing course registrations built with Java Swing, demonstrating core OOP concepts including inheritance and polymorphism.',
      highlight: 'Clean class hierarchy with Person → Student/Lecturer inheritance, course enrollment logic, and GUI-driven data management.',
      links: [
        { label: 'GitHub', value: 'https://github.com/ziadsaid2/Course_Registration_System', href: 'https://github.com/ziadsaid2/Course_Registration_System' },
      ],
    },
    {
      name: 'ShopWise E-Commerce',
      techStack: ['React', 'Redux Toolkit', 'Vite', 'React Router', 'Axios'],
      summary: 'Modern e-commerce frontend with product browsing, dynamic routing, category filtering, cart management, and Fake Store API integration.',
      highlight: 'Redux Toolkit state management, search & sort functionality, quantity controls, and toast notification feedback.',
      links: [
        { label: 'GitHub', value: 'https://github.com/ziadsaid2/shop', href: 'https://github.com/ziadsaid2/shop' },
      ],
    },
  ],
  skillGroups: [
    {
      title: 'Frontend',
      items: [
        { name: 'Next.js', level: 95 },
        { name: 'React', level: 94 },
        { name: 'TypeScript', level: 92 },
        { name: 'JavaScript', level: 90 },
        { name: 'TanStack React Query', level: 88 },
        { name: 'Tailwind CSS', level: 93 },
        { name: 'Ant Design', level: 85 },
        { name: 'Zod', level: 86 },
      ],
    },
    {
      title: 'Backend',
      items: [
        { name: 'Node.js', level: 90 },
        { name: 'NestJS', level: 88 },
        { name: 'Fastify', level: 84 },
        { name: 'Socket.IO', level: 82 },
        { name: 'NATS', level: 75 },
      ],
    },
    {
      title: 'Databases',
      items: [
        { name: 'PostgreSQL', level: 86 },
        { name: 'Redis', level: 80 },
        { name: 'Prisma', level: 88 },
        { name: 'TypeORM', level: 84 },
        { name: 'Sequelize', level: 82 },
      ],
    },
    {
      title: 'Workflow',
      items: [
        { name: 'Docker', level: 84 },
        { name: 'AWS S3', level: 78 },
        { name: 'Git', level: 90 },
        { name: 'GitHub', level: 92 },
        { name: 'Datadog', level: 74 },
        { name: 'Jira', level: 85 },
        { name: 'Confluence', level: 82 },
        { name: 'Slack', level: 90 },
      ],
    },
  ],
  experience: [
    {
      period: 'Mar 2026 - Present',
      startDate: '2026-03-01',
      role: 'Full Stack Developer',
      company: 'Flovoo',
      location: 'Istanbul, Türkiye · Remote',
      roles: [
        {
          title: 'Full Stack Developer (Full-time)',
          period: 'Mar 2026 - Present · 1 mo',
          bullets: [
            'Building real-time chat experiences, frontend dashboards, backend services, authentication flows, and widget-based messaging features.',
            'Developing storage systems and external integrations including WhatsApp and Meta channels.',
          ]
        }
      ],
      bullets: [
        'Flovoo is a modern customer communication and messaging platform that helps businesses manage conversations, contacts, teams, subscriptions, and channel integrations from one unified system.'
      ],
      technologies: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Node.js', 'PostgreSQL', 'Sequelize', 'Redis', 'Socket.IO', 'NATS', 'AWS S3', 'Tailwind CSS', 'TanStack React Query', 'Zod', 'Docker'],
    },
    {
      period: 'Dec 2025 - Present · 5 mos',
      role: 'Full Stack Developer',
      company: 'Eduncy',
      location: 'Istanbul, Türkiye · Remote',
      roles: [
        {
          title: 'Full Stack Developer (Full-time)',
          period: 'Feb 2026 - Present',
          startDate: '2026-02-01',
          bullets: [
            'Working across both frontend and backend to build analytics dashboards, real-time communication features, and integration-heavy systems.',
            'Developing and maintaining seamless internal workflows that power CRM operations for study-abroad agencies.'
          ]
        },
        {
          title: 'Full Stack Developer (Internship)',
          period: 'Dec 2025 - Jan 2026',
          startDate: '2025-12-01',
          bullets: [
            'Started contributing as an intern to scalable internal systems and CRM workflows.',
            'Gained hands-on experience by rapidly pushing production-oriented tasks and resolving business flow challenges.'
          ]
        }
      ],
      bullets: [
        'Eduncy is a CRM and operations platform built for study-abroad and scholarship agencies, helping them manage the full student journey from leads and inquiries to applications, follow-ups, payments, and analytics.'
      ],
      technologies: ['Next.js', 'React', 'TypeScript', 'NestJS', 'Node.js', 'PostgreSQL', 'TypeORM', 'Redis', 'Socket.IO', 'NATS', 'AWS S3', 'Ant Design', 'TanStack React Query', 'Zod', 'Docker'],
    },
  ],
  education: {
    institution: 'Alexandria University',
    degree: 'Computer Science',
    period: 'Sep 2024 - Jun 2028',
    details: [
      'Full Stack Nodejs Diploma - AMIT Learning (2025)',
      'Web Development & Interaction Design Focus (Digital Training)',
    ],
    certifications: [
      'Laravel 12: The Complete Guide for Beginners - Udemy (2026)',
      'AI For Backend Engineers - Udemy (2026)',
      'Git and GitHub - Almdrasa (2026)',
      'Full Stack Nodejs Diploma - AMIT Learning (2025)',
      'Responsive Web Design - freeCodeCamp (2025)',
    ],
    additionalLearning: [
      'Advanced Backend Architecture & Scalability',
      'Real-time Systems (Socket.IO, NATS, Redis)',
      'AI-Driven Workflows (Cursor, MCP, LLM Integration)',
    ],
  },
  contacts: [...profileContacts],
  terminal: {
    user: 'ziad',
    host: 'portfolio',
    path: '~',
    title: 'Interactive Portfolio Terminal',
    statusLabel: 'online',
    welcomeCommand: '/welcome',
    footerHintLeft: 'Type help for available commands. Use up/down for history.',
    footerHintRight: 'Use clear to reset terminal screen.',
  },
}
