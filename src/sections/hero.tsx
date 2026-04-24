"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import SocialIcon from "@/components/ui/social-icon";
import { themePalette, useTheme } from "@/components/theme-store";

const HERO_BASE_IMAGE = "/hero/base-1800.png";
const HERO_REVEAL_IMAGE = "/hero/reveal-1800.png";

const CursorLens = dynamic(() => import("@/components/cursor-lens"), {
  ssr: false,
});

function HeroCanvasFallback({ backgroundColor }: { backgroundColor: string }) {
  return (
    <div
      className="hero-canvas-fallback"
      style={{ "--hero-canvas-background": backgroundColor } as CSSProperties}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [canRenderLens, setCanRenderLens] = useState(false);
  const [shouldRenderLens, setShouldRenderLens] = useState(false);
  const theme = useTheme();
  const palette = themePalette[theme];

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");

    const updateLensSupport = () => {
      setCanRenderLens(finePointerQuery.matches && !reducedMotionQuery.matches);
    };

    updateLensSupport();
    reducedMotionQuery.addEventListener("change", updateLensSupport);
    finePointerQuery.addEventListener("change", updateLensSupport);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateLensSupport);
      finePointerQuery.removeEventListener("change", updateLensSupport);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry?.isIntersecting ?? false);
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canRenderLens || !isHeroInView || shouldRenderLens) {
      return;
    }

    let timeoutId: number | undefined;

    const enableLens = () => {
      timeoutId = window.setTimeout(() => {
        setShouldRenderLens(true);
      }, 300);
    };

    if (document.readyState === "complete") {
      enableLens();
    } else {
      window.addEventListener("load", enableLens, { once: true });
    }

    return () => {
      window.removeEventListener("load", enableLens);
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [canRenderLens, isHeroInView, shouldRenderLens]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="hero-section"
      onPointerEnter={() => {
        if (canRenderLens) {
          setShouldRenderLens(true);
        }
      }}
    >
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
          <HeroCanvasFallback backgroundColor={palette.heroBackground} />
          {isHeroInView && shouldRenderLens ? (
            <CursorLens
              baseImage={HERO_BASE_IMAGE}
              revealImage={HERO_REVEAL_IMAGE}
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
              animateBackground={true}
              bgBlobCount={11}
              bgBlobSize={300}
              bgBlobComplexity={140}
              bgBlobSpeed={0.8}
              blobStrokeWidth={1.5}
              blobSize={240}
              shapeComplexity={1.5}
              roughness={50}
              speed={600}
              viscosity={4}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
