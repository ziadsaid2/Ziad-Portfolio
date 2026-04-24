"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";

import { useBootReady } from "@/lib/use-boot-ready";

const navItems = [
  { id: "hero", label: "00 // INTRO", short: "INTRO" },
  { id: "about", label: "01 // DOSSIER", short: "ABOUT" },
  { id: "skills", label: "02 // SKILLS", short: "SKILLS" },
  { id: "experience", label: "03 // RECORD", short: "EXPERIENCE" },
  { id: "terminal", label: "04 // TERMINAL", short: "TERMINAL" },
  { id: "certifications", label: "05 // MODULES", short: "CERTS" },
];

export default function FloatingProgressIndicator() {
  const bootReady = useBootReady();
  const [activeSection, setActiveSection] = useState("hero");
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Idle state to fade out when not in use
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!bootReady) {
      return;
    }

    setIsMounted(true);

    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => setIsIdle(true), 800);
    };

    // Smooth, precise section detection
    const handleScroll = () => {
      resetIdle();
      // Trigger point is at 1/3 of the screen height from the top
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      // Reverse to check from bottom up
      for (let i = navItems.length - 1; i >= 0; i--) {
        const section = document.getElementById(navItems[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    setTimeout(handleScroll, 100);
    resetIdle();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [bootReady]);

  if (!bootReady || !isMounted) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop,
        behavior: "smooth"
      });
    }
  };

  const isAnyHovered = hoveredId !== null;
  // If we are idle and not hovering the nav, we dim it.
  const shouldDim = isIdle && !isAnyHovered;

  return (
    <motion.nav 
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: shouldDim ? 0.15 : 1, 
        x: 0,
        filter: shouldDim ? "blur(2px) grayscale(50%)" : "blur(0px) grayscale(0%)"
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed z-[var(--z-floating)] top-1/2 right-1 md:right-2 lg:right-3 -translate-y-1/2 flex flex-col items-end gap-0 py-4 pointer-events-none"
      onMouseEnter={() => {
        setIsIdle(false);
        if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      }}
    >
      {/* Subtle vertical trace line for the HUD look */}
      <div className="absolute top-2 bottom-2 right-[3px] w-[1px] bg-[color-mix(in_srgb,var(--color-page-foreground)_10%,transparent)] -z-10 rounded-full" />

      {navItems.map((item) => {
        const isActive = activeSection === item.id;
        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            className="group relative flex items-center justify-end h-8 md:h-10 w-10 md:w-12 pointer-events-auto"
            data-cursor="interactive"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => scrollToSection(item.id)}
          >
            {/* Label sliding out ON HOVER ONLY */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 5, filter: "blur(2px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: 5, filter: "blur(2px)" }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-6 font-mono text-[9px] md:text-[10px] uppercase tracking-widest whitespace-nowrap text-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)] bg-[color-mix(in_srgb,var(--color-page-background)_95%,transparent)] backdrop-blur-md px-2.5 py-1.5 rounded-sm border border-[color-mix(in_srgb,var(--color-page-foreground)_5%,transparent)] shadow-sm cursor-pointer"
                >
                  {item.short}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Interactive Node/Line Area */}
            <div className="relative w-6 h-full flex items-center justify-end pr-[2.5px]">
              {/* Sliding Active Trace Bar */}
              {isActive && (
                <motion.div 
                  layoutId="activeProgressTrace"
                  className="absolute right-[1.5px] w-[2px] h-5 bg-[var(--color-accent-primary)] rounded-full shadow-[0_0_8px_var(--color-accent-primary)] z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              
              {/* Individual Dots */}
              <div 
                className={`w-1 h-1 rounded-full transition-all duration-300 z-0 ${
                  isActive 
                    ? "opacity-0" // Hide dot when the bar takes over
                    : "bg-[color-mix(in_srgb,var(--color-page-foreground)_20%,transparent)] group-hover:bg-[color-mix(in_srgb,var(--color-page-foreground)_70%,transparent)] group-hover:scale-150"
                }`}
              />
            </div>
          </div>
        );
      })}
    </motion.nav>
  );
}
