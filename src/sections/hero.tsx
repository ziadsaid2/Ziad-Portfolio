"use client";

import CursorLens from "@/components/cursor-lens";
import SocialIcon from "@/components/ui/social-icon";
import { themePalette, useTheme } from "@/components/theme-store";

export default function Hero() {
  const theme = useTheme();
  const palette = themePalette[theme];
  return (
    <section id="hero" className="hero-section">
      <div className="hero-frame">
        <div className="hero-content">
          <div className="hero-copy hero-copy--name">
            <p className="hero-greeting">Hi, I&apos;m</p>
            <h1 className="hero-title">
              <span className="hero-title__first">ZIAD</span>
              <span className="hero-title__last">SAID</span>
            </h1>
          </div>

          <div className="hero-copy hero-copy--role" aria-label="Role">
            <div className="hero-role">
              <span className="hero-role__item block-solid">Full Stack</span>
              <span className="hero-role__item block-outline">Developer</span>
            </div>
          </div>

          <div className="hero-copy hero-copy--social flex flex-col gap-3 md:gap-4">
            <div className="flex items-center gap-3 opacity-60 pointer-events-none select-none ml-1">
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.6em] text-[var(--color-accent-primary)]/80">
                GET IN TOUCH
              </span>
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[var(--color-accent-primary)]/40 rotate-45" />
                <div className="h-px w-8 sm:w-16 bg-gradient-to-r from-[var(--color-accent-primary)]/40 to-transparent" />
              </div>
            </div>
            <SocialIcon />
          </div>
        </div>

        <div className="hero-canvas" aria-hidden="true">
          <CursorLens
            baseImage="/hero/base.png"
            revealImage="/hero/reveal.png"
            objectFit="contain"
            imagePosition="center bottom"
            imageSize="var(--hero-image-size, auto 145vh)"
            backgroundColor={palette.heroBackground}
            blobOutlineColor={palette.heroLineColor}
            bgBlobOpacity={palette.heroLineOpacity}
            hoverBlobColor={palette.heroHoverBlob}
            hoverBlobOpacity={palette.heroHoverBlobOpacity}
            parallaxStrength={8}
            showBackground={true}
            bgBlobCount={11}
            bgBlobSize={300}
            bgBlobComplexity={200}
            bgBlobSpeed={0.8}
            blobStrokeWidth={1.5}
            blobSize={240}
            shapeComplexity={1.5}
            roughness={50}
            speed={600}
            viscosity={4}
          />
        </div>
      </div>
    </section>
  );
}
