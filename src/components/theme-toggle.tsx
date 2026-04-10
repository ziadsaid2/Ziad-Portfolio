"use client";

import { applyTheme, useTheme, useThemePreference } from "@/components/theme-store";
import { Sun, MonitorSmartphone, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: MonitorSmartphone },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

export default function ThemeToggle() {
  const theme = useTheme();
  const preference = useThemePreference();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia("(max-width: 768px)");
    setIsMobile(mql.matches);
    setIsExpanded(!mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      setIsExpanded(!e.matches);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Close when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isExpanded) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile, isExpanded]);

  if (!mounted) return null;

  const visibleOptions = isExpanded ? themeOptions : themeOptions.filter((o) => o.value === preference);

  return (
    <div 
      className="fixed z-[var(--z-floating)]"
      style={{
        top: "clamp(2rem, 5vh, 3rem)",
        right: "clamp(1.1rem, 4vw, 3rem)"
      }}
      ref={containerRef}
    >
      <motion.div
        layout
        className="flex items-center gap-1 p-1 backdrop-blur-xl shadow-2xl transition-colors duration-300"
        style={{ 
          borderRadius: 9999,
          background: "var(--color-toggle-background)",
          border: "1px solid var(--color-toggle-border)"
        }}
        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      >
        <AnimatePresence mode="popLayout">
          {visibleOptions.map((option) => {
            const isActive = preference === option.value;
            const Icon = option.icon;

            return (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                key={option.value}
                type="button"
                data-cursor="interactive"
                onClick={() => {
                  if (isMobile && !isExpanded) {
                    setIsExpanded(true);
                  } else {
                    applyTheme(option.value);
                    if (isMobile) setIsExpanded(false);
                  }
                }}
                className={`relative flex items-center justify-center rounded-full h-10 transition-colors duration-300 ${
                  isActive
                    ? "text-[var(--color-accent-primary)]"
                    : "text-[var(--color-page-foreground)] opacity-60 hover:opacity-100"
                }`}
                style={{
                  cursor: "none",
                  padding: isActive && isExpanded ? "0 1.2rem 0 1rem" : "0 0.8rem",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-theme-pill"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "var(--color-toggle-track)",
                      boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--color-accent-primary) 16%, transparent)"
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div
                  layout
                  className="relative z-10 flex items-center justify-center gap-2.5 pointer-events-none"
                >
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />

                  <AnimatePresence initial={false} mode="popLayout">
                    {isActive && isExpanded && (
                      <motion.span
                        layout
                        initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
                        transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                        className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap"
                      >
                        {option.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
