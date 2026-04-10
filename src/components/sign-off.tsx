'use client';

import { useState, useRef } from 'react';

export function SignOff() {
  const nameRef = useRef<HTMLDivElement>(null);
  const [nameMousePos, setNameMousePos] = useState({ x: 0, y: 0 });
  const [isNameHovered, setIsNameHovered] = useState(false);

  const handleNameMouseMove = (e: React.MouseEvent) => {
    if (!nameRef.current) return;
    const rect = nameRef.current.getBoundingClientRect();
    setNameMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="w-full mt-4 md:mt-6 pb-2 md:pb-3 select-none group/name relative" style={{ overflow: 'clip' }}>
      <div className="w-full relative px-6 md:px-12">
        {/* Section Marker */}
        <div className="flex items-center gap-10 w-full mb-4 opacity-10">
          <div className="h-px flex-1 bg-current" />
          <span className="text-[10px] font-mono whitespace-nowrap tracking-[0.6em] uppercase font-bold text-[var(--color-accent-primary)]">
            007 // SIGN_OFF
          </span>
          <div className="h-px flex-1 bg-current" />
        </div>

        <div 
          ref={nameRef}
          onMouseMove={handleNameMouseMove}
          onMouseEnter={() => setIsNameHovered(true)}
          onMouseLeave={() => setIsNameHovered(false)}
          className="relative flex justify-center w-full group/interactive cursor-default"
        >
          {/* Layer 1: Base - Light Amber Outline (Default) */}
          <h2 
            className="text-center text-[12.5vw] sm:text-[13vw] md:text-[13.5vw] font-black uppercase leading-[0.8] select-none whitespace-nowrap flex items-center justify-center gap-[0.1em] transition-opacity duration-700"
            style={{
              fontFamily: 'var(--font-wide)',
              color: 'transparent',
              /* Subtle base stroke */
              WebkitTextStroke: '1.3px color-mix(in srgb, var(--color-accent-primary), transparent 55%)',
              paintOrder: 'stroke fill',
              letterSpacing: '-0.05em',
            }}
          >
            <span>ZIAD</span>
            <span>SAID</span>
          </h2>

          {/* Layer 2: Highlight - Strong Spotlight */}
          <h2 
            className="absolute inset-0 text-center text-[12.5vw] sm:text-[13vw] md:text-[13.5vw] font-black uppercase leading-[0.8] select-none whitespace-nowrap flex items-center justify-center gap-[0.1em] pointer-events-none"
            style={{
              fontFamily: 'var(--font-wide)',
              color: 'transparent',
              /* Stronger stroke for impactful intensification */
              WebkitTextStroke: '2.0px var(--color-accent-primary)',
              paintOrder: 'stroke fill',
              letterSpacing: '-0.05em',
              /* Larger spotlight radius for better coverage */
              maskImage: `radial-gradient(circle 125px at ${nameMousePos.x}px ${nameMousePos.y}px, black 0%, transparent 100%)`,
              WebkitMaskImage: `radial-gradient(circle 125px at ${nameMousePos.x}px ${nameMousePos.y}px, black 0%, transparent 100%)`,
              /* Stronger, more vibrant glow */
              filter: 'drop-shadow(0 0 20px var(--color-accent-primary))',
              opacity: isNameHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-out'
            }}
          >
            <span>ZIAD</span>
            <span>SAID</span>
          </h2>

        </div>

        <div className="w-full h-px mt-2 bg-gradient-to-r from-transparent via-[var(--color-accent-primary)]/10 to-transparent" />
      </div>
    </div>
  );
}
