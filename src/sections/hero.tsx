"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import SocialIcon from "@/components/ui/social-icon";
import { themePalette, useTheme } from "@/components/theme-store";

const HERO_BASE_IMAGE = "/hero/base-1800.png";
const HERO_REVEAL_IMAGE = "/hero/reveal-1800.png";

type HeroQualityTier = "static" | "lite" | "full";
type HeroBrowserProfile = "safari-static" | "adaptive";

type NavigatorWithDeviceHints = Navigator & {
  deviceMemory?: number;
  connection?: {
    effectiveType?: string;
    saveData?: boolean;
    addEventListener?: (type: "change", listener: EventListener) => void;
    removeEventListener?: (type: "change", listener: EventListener) => void;
  };
};

const CursorLens = dynamic(() => import("@/components/cursor-lens"), {
  ssr: false,
});

const resolveHeroBrowserProfile = (): HeroBrowserProfile => {
  const userAgent = navigator.userAgent.toLowerCase();
  const vendor = navigator.vendor.toLowerCase();
  const isWebKit = userAgent.includes("applewebkit/");
  const isSafari =
    vendor.includes("apple") &&
    isWebKit &&
    !userAgent.includes("crios/") &&
    !userAgent.includes("fxios/") &&
    !userAgent.includes("edg/") &&
    !userAgent.includes("opr/");

  return isSafari ? "safari-static" : "adaptive";
};

const resolveHeroQualityTier = ({
  finePointer,
  reducedMotion,
}: {
  finePointer: boolean;
  reducedMotion: boolean;
}): HeroQualityTier => {
  if (!finePointer || reducedMotion) {
    return "static";
  }

  if (resolveHeroBrowserProfile() === "safari-static") {
    return "static";
  }

  const navigatorWithHints = navigator as NavigatorWithDeviceHints;
  const connection = navigatorWithHints.connection;
  const memory = navigatorWithHints.deviceMemory;
  const cores = navigatorWithHints.hardwareConcurrency;
  let lowPowerScore = 0;

  if (connection?.saveData) {
    lowPowerScore += 2;
  }

  if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
    lowPowerScore += 2;
  } else if (connection?.effectiveType === "3g") {
    lowPowerScore += 1;
  }

  if (typeof memory === "number") {
    if (memory <= 2) {
      lowPowerScore += 2;
    } else if (memory <= 4) {
      lowPowerScore += 1;
    }
  } else {
    lowPowerScore += 1;
  }

  if (typeof cores === "number") {
    if (cores <= 2) {
      lowPowerScore += 2;
    } else if (cores <= 4) {
      lowPowerScore += 1;
    }
  } else {
    lowPowerScore += 1;
  }

  return lowPowerScore >= 2 ? "lite" : "full";
};

function HeroCanvasFallback({
  backgroundColor,
  qualityTier,
}: {
  backgroundColor: string;
  qualityTier: HeroQualityTier;
}) {
  const className =
    qualityTier === "full"
      ? "hero-canvas-fallback"
      : "hero-canvas-fallback hero-canvas-fallback--scenic";

  return (
    <div
      className={className}
      style={{ "--hero-canvas-background": backgroundColor } as CSSProperties}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isHeroInView, setIsHeroInView] = useState(true);
  const [heroQualityTier, setHeroQualityTier] = useState<HeroQualityTier>("static");
  const [shouldRenderLens, setShouldRenderLens] = useState(false);
  const theme = useTheme();
  const palette = themePalette[theme];
  const canRenderLens = heroQualityTier !== "static";
  const lensQuality = heroQualityTier === "full" ? "full" : "lite";
  const lensTuning =
    heroQualityTier === "full"
      ? {
          parallaxStrength: 8,
          showBackground: true,
          animateBackground: true,
          bgBlobCount: 11,
          bgBlobSize: 300,
          bgBlobComplexity: 140,
          bgBlobSpeed: 0.8,
          blobStrokeWidth: 1.5,
          blobSize: 240,
          shapeComplexity: 1.5,
          roughness: 50,
          speed: 600,
          viscosity: 4,
        }
      : {
          parallaxStrength: 4,
          showBackground: true,
          animateBackground: false,
          bgBlobCount: 5,
          bgBlobSize: 220,
          bgBlobComplexity: 0,
          bgBlobSpeed: 0.6,
          blobStrokeWidth: 1.1,
          blobSize: 180,
          shapeComplexity: 0.95,
          roughness: 0,
          speed: 420,
          viscosity: 3,
        };

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(pointer: fine)");
    const navigatorWithHints = navigator as NavigatorWithDeviceHints;
    const connection = navigatorWithHints.connection;

    const updateHeroQuality = () => {
      const nextTier = resolveHeroQualityTier({
        finePointer: finePointerQuery.matches,
        reducedMotion: reducedMotionQuery.matches,
      });

      setHeroQualityTier((currentTier) =>
        currentTier === nextTier ? currentTier : nextTier,
      );
    };

    updateHeroQuality();
    reducedMotionQuery.addEventListener("change", updateHeroQuality);
    finePointerQuery.addEventListener("change", updateHeroQuality);
    connection?.addEventListener?.("change", updateHeroQuality);

    return () => {
      reducedMotionQuery.removeEventListener("change", updateHeroQuality);
      finePointerQuery.removeEventListener("change", updateHeroQuality);
      connection?.removeEventListener?.("change", updateHeroQuality);
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
          <HeroCanvasFallback
            backgroundColor={palette.heroBackground}
            qualityTier={heroQualityTier}
          />
          {isHeroInView && canRenderLens && shouldRenderLens ? (
            <CursorLens
              baseImage={HERO_BASE_IMAGE}
              revealImage={HERO_REVEAL_IMAGE}
              quality={lensQuality}
              objectFit="contain"
              imagePosition="center bottom"
              imageSize="var(--hero-image-size, auto 145vh)"
              backgroundColor={palette.heroBackground}
              blobOutlineColor={palette.heroLineColor}
              bgBlobOpacity={palette.heroLineOpacity}
              hoverBlobColor={palette.heroHoverBlob}
              hoverBlobOpacity={palette.heroHoverBlobOpacity}
              {...lensTuning}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
