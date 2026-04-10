import Hero from "@/sections/hero";
import AboutMeSection from "@/sections/about-me";
import ExperienceSection from "@/sections/experience";
import SkillsSection from "@/sections/skills";
import TerminalShowcase from "@/sections/terminal-showcase";
import CertificationsSection from "@/sections/certifications";
import { SectionDivider } from "@/components/section-divider";
import { SignOff } from "@/components/sign-off";
export default function Home() {
  return (
    <main>
      <Hero />
      <SectionDivider />
      <AboutMeSection />
      <SectionDivider />
      <SkillsSection />
      <SectionDivider />
      <ExperienceSection />
      <SectionDivider />
      <TerminalShowcase />
      <SectionDivider />
      <CertificationsSection />
      <SignOff />
    </main>
  );
}
