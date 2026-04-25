export const profileLinks = {
  email: "ziadsaidahmed2005@gmail.com",
  github: "https://github.com/ziadsaid2",
  linkedin: "https://www.linkedin.com/in/ziadsaid/",
  whatsapp: "https://wa.me/201010695751",
  resume: "/cv/ziad-said-cv.pdf",
} as const;

export const profileContacts = [
  {
    label: "Email",
    value: profileLinks.email,
    href: `mailto:${profileLinks.email}`,
  },
  {
    label: "GitHub",
    value: profileLinks.github,
    href: profileLinks.github,
  },
  {
    label: "LinkedIn",
    value: profileLinks.linkedin,
    href: profileLinks.linkedin,
  },
  {
    label: "WhatsApp",
    value: "+20 101 069 5751",
    href: profileLinks.whatsapp,
  },
] as const;
