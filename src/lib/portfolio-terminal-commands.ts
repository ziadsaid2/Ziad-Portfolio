export type PortfolioTerminalCommand = {
  command: string
  helpText: string
  cheatSheetText: string
}

export const portfolioTerminalCommands: PortfolioTerminalCommand[] = [
  {
    command: 'about',
    helpText: 'Display personal information',
    cheatSheetText: 'who am i',
  },
  {
    command: 'projects',
    helpText: 'View selected work',
    cheatSheetText: 'recent work',
  },
  {
    command: 'skills',
    helpText: 'Show technical strengths',
    cheatSheetText: 'tech stack',
  },
  {
    command: 'experience',
    helpText: 'Display work history',
    cheatSheetText: 'career path',
  },
  {
    command: 'education',
    helpText: 'View education and learning',
    cheatSheetText: 'learning track',
  },
  {
    command: 'contact',
    helpText: 'Show contact information',
    cheatSheetText: 'get in touch',
  },
  {
    command: 'clear',
    helpText: 'Clear terminal screen',
    cheatSheetText: 'reset view',
  },
  {
    command: 'help',
    helpText: 'Display this help message',
    cheatSheetText: 'list commands',
  },
]
