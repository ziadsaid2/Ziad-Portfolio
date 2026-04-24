"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTime,
  useTransform,
} from "motion/react";

type CursorLensProps = {
  baseImage?: string;
  revealImage?: string;
  objectFit?: "cover" | "contain";
  imagePosition?: string;
  imageSize?: string;
  backgroundColor?: string;
  blobOutlineColor?: string;
  hoverBlobColor?: string;
  bgBlobOpacity?: number;
  hoverBlobOpacity?: number;
  parallaxStrength?: number;
  showBackground?: boolean;
  animateBackground?: boolean;
  bgBlobCount?: number;
  bgBlobSize?: number;
  bgBlobComplexity?: number;
  bgBlobSpeed?: number;
  blobStrokeWidth?: number;
  previewCursor?: boolean;
  blobSize?: number;
  shapeComplexity?: number;
  roughness?: number;
  speed?: number;
  viscosity?: number;
};

export default function CursorLens({
  baseImage = "/hero/base.png",
  revealImage = "/hero/reveal.png",
  objectFit = "cover",
  imagePosition = "center",
  imageSize,
  backgroundColor = "#1a1a2e",
  blobOutlineColor = "#4a4e69",
  hoverBlobColor = "black",
  bgBlobOpacity = 0.5,
  hoverBlobOpacity = 0.12,
  parallaxStrength = 4,
  showBackground = true,
  animateBackground = true,
  bgBlobCount = 15,
  bgBlobSize = 80,
  bgBlobSpeed = 1,
  bgBlobComplexity = 60,
  blobStrokeWidth = 1,
  previewCursor = false,
  blobSize = 120,
  shapeComplexity = 0.8,
  roughness = 0,
  speed = 250,
  viscosity = 1,
}: CursorLensProps) {
  const [isHovering, setIsHovering] = React.useState(false);
  const [isTouch, setIsTouch] = React.useState(false);
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const isActive = isHovering || previewCursor;

  const containerRef = React.useRef<HTMLDivElement>(null);

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const [backgroundBlobs, setBackgroundBlobs] = React.useState<
    { x: string[]; y: string[]; sizeFactor: number; duration: number }[]
  >([]);

  React.useEffect(() => {
    setBackgroundBlobs(
      [...Array(bgBlobCount)].map(() => ({
        x: [
          random(-20, 110) + "%",
          random(-20, 110) + "%",
          random(-20, 110) + "%",
        ],
        y: [
          random(-20, 110) + "%",
          random(-20, 110) + "%",
          random(-20, 110) + "%",
        ],
        sizeFactor: random(0.5, 1.5),
        duration: random(25, 50) / bgBlobSpeed,
      }))
    );
  }, [bgBlobCount, bgBlobSpeed]);

  React.useEffect(() => {
    const mqTouch = window.matchMedia("(pointer: coarse)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsTouch(mqTouch.matches);
    setReducedMotion(mqMotion.matches);
    const onTouch = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mqTouch.addEventListener("change", onTouch);
    mqMotion.addEventListener("change", onMotion);
    return () => {
      mqTouch.removeEventListener("change", onTouch);
      mqMotion.removeEventListener("change", onMotion);
    };
  }, []);

  const bgFilterId = React.useId();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXRatio = useMotionValue(0);
  const mouseYRatio = useMotionValue(0);

  const smoothOptions = { damping: 50, stiffness: 400 };
  const smoothX = useSpring(mouseXRatio, smoothOptions);
  const smoothY = useSpring(mouseYRatio, smoothOptions);

  const baseX = useTransform(
    smoothX,
    [-1, 1],
    [parallaxStrength, -parallaxStrength],
  );
  const baseY = useTransform(
    smoothY,
    [-1, 1],
    [parallaxStrength, -parallaxStrength],
  );
  const revealX = useTransform(
    smoothX,
    [-1, 1],
    [parallaxStrength * 2.5, -parallaxStrength * 2.5],
  );
  const revealY = useTransform(
    smoothY,
    [-1, 1],
    [parallaxStrength * 2.5, -parallaxStrength * 2.5],
  );

  React.useEffect(() => {
    if (isTouch) return;

    let rafId = 0;
    let pendingX = 0;
    let pendingY = 0;
    let hasPending = false;

    const flush = () => {
      rafId = 0;
      if (!hasPending || !containerRef.current) return;
      hasPending = false;

      const rect = containerRef.current.getBoundingClientRect();
      const isInside =
        pendingX >= rect.left &&
        pendingX <= rect.right &&
        pendingY >= rect.top &&
        pendingY <= rect.bottom;

      if (isInside) {
        const x = pendingX - rect.left;
        const y = pendingY - rect.top;
        mouseX.set(x);
        mouseY.set(y);
        mouseXRatio.set((x / rect.width) * 2 - 1);
        mouseYRatio.set((y / rect.height) * 2 - 1);
      } else {
        mouseXRatio.set(0);
        mouseYRatio.set(0);
      }
    };

    const handleMove = (e: MouseEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      hasPending = true;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mouseX, mouseY, mouseXRatio, mouseYRatio, isTouch]);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseXRatio.set(0);
    mouseYRatio.set(0);
  };

  const time = useTime();

  const useWake = (index: number) => {
    const stiffness = speed * (1 - index * 0.15);
    const damping = 20 + viscosity * index * 5;
    const mass = 0.1 + index * 0.1;
    return {
      x: useSpring(mouseX, { stiffness, damping, mass }),
      y: useSpring(mouseY, { stiffness, damping, mass }),
    };
  };

  const head = useWake(0);
  const body1 = useWake(1);
  const body2 = useWake(2);
  const tail = useWake(4);

  const complexityRadius = blobSize * shapeComplexity * 0.6;
  const sat1X = useTransform(
    time,
    (t) => head.x.get() + Math.sin(t * 0.002) * complexityRadius,
  );
  const sat1Y = useTransform(
    time,
    (t) => head.y.get() + Math.cos(t * 0.002) * complexityRadius,
  );
  const sat2X = useTransform(
    time,
    (t) => head.x.get() + Math.cos(t * 0.004) * (complexityRadius * 0.8),
  );
  const sat2Y = useTransform(
    time,
    (t) => head.y.get() + Math.sin(t * 0.004) * (complexityRadius * 0.8),
  );

  const cursorFilterId = React.useId();
  const maskId = React.useId();

  if (isTouch) {
    return (
      <div style={{ ...containerStyle, backgroundColor: backgroundColor }}>
        <div style={{ ...layerContainerStyle, zIndex: 10 }}>
          <div
            style={{
              ...imageStyle,
              backgroundImage: `url(${baseImage})`,
              backgroundSize: imageSize ?? objectFit,
              backgroundPosition: imagePosition,
              transform: "scale(1.1)",
              willChange: "auto",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...containerStyle, backgroundColor: backgroundColor }}
    >
      {showBackground && (
        <>
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <filter id={bgFilterId}>
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.008"
                  numOctaves="3"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={bgBlobComplexity}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>

          <svg
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              zIndex: 0,
              overflow: "visible",
            }}
          >
            <g filter={`url(#${bgFilterId})`}>
              {backgroundBlobs.map((blob, i) =>
                reducedMotion || !animateBackground ? (
                  <circle
                    key={i}
                    cx={blob.x[0]}
                    cy={blob.y[0]}
                    r={blob.sizeFactor * bgBlobSize}
                    fill="none"
                    stroke={blobOutlineColor}
                    strokeWidth={blobStrokeWidth}
                    strokeOpacity={bgBlobOpacity}
                  />
                ) : (
                  <motion.circle
                    key={i}
                    initial={{ cx: blob.x[0], cy: blob.y[0] }}
                    animate={{ cx: blob.x, cy: blob.y }}
                    transition={{
                      duration: blob.duration,
                      repeat: Infinity,
                      repeatType: "mirror" as const,
                      ease: "easeInOut",
                    }}
                    r={blob.sizeFactor * bgBlobSize}
                    fill="none"
                    stroke={blobOutlineColor}
                    strokeWidth={blobStrokeWidth}
                    strokeOpacity={bgBlobOpacity}
                  />
                ),
              )}
            </g>
          </svg>
        </>
      )}

      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={cursorFilterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={roughness}
              xChannelSelector="R"
              yChannelSelector="G"
              result="distorted"
            />
            <feGaussianBlur in="distorted" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <defs>
          <mask id={maskId}>
            <g filter={`url(#${cursorFilterId})`}>
              <motion.g
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0.6,
                }}
                transition={{
                  opacity: {
                    duration: isActive ? 0.35 : 0.55,
                    ease: isActive ? "easeOut" : "easeIn",
                  },
                  scale: {
                    duration: isActive ? 0.4 : 0.6,
                    ease: isActive ? "easeOut" : "easeIn",
                  },
                }}
                style={{ transformOrigin: "center" }}
              >
                <motion.circle
                  cx={sat1X}
                  cy={sat1Y}
                  r={blobSize * 0.6}
                  fill="white"
                />
                <motion.circle
                  cx={sat2X}
                  cy={sat2Y}
                  r={blobSize * 0.5}
                  fill="white"
                />
                <motion.circle
                  cx={head.x}
                  cy={head.y}
                  r={blobSize * 0.7}
                  fill="white"
                />
                <motion.circle
                  cx={body1.x}
                  cy={body1.y}
                  r={blobSize * 0.6}
                  fill="white"
                />
                <motion.circle
                  cx={body2.x}
                  cy={body2.y}
                  r={blobSize * 0.5}
                  fill="white"
                />
                <motion.circle
                  cx={tail.x}
                  cy={tail.y}
                  r={blobSize * 0.3}
                  fill="white"
                />
              </motion.g>
            </g>
          </mask>
        </defs>
      </svg>

      <div style={{ ...layerContainerStyle, zIndex: 10 }}>
        <motion.div
          style={{
            ...imageStyle,
            backgroundImage: `url(${baseImage})`,
            backgroundSize: imageSize ?? objectFit,
            backgroundPosition: imagePosition,
            x: baseX,
            y: baseY,
            scale: 1.1,
          }}
        />
      </div>

      {/* Visible grey gooey cursor blob — same amoeba shape as the reveal mask */}
      <motion.svg
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 15,
        }}
        animate={{ opacity: isActive ? hoverBlobOpacity : 0 }}
        transition={{ duration: isActive ? 0.35 : 0.55 }}
      >
        <g filter={`url(#${cursorFilterId})`}>
          <motion.g
            animate={{
              scale: isActive ? 1 : 0.6,
            }}
            transition={{
              scale: {
                duration: isActive ? 0.4 : 0.6,
                ease: isActive ? "easeOut" : "easeIn",
              },
            }}
            style={{ transformOrigin: "center" }}
          >
            <motion.circle
              cx={sat1X}
              cy={sat1Y}
              r={blobSize * 0.6}
              fill={hoverBlobColor}
            />
            <motion.circle
              cx={sat2X}
              cy={sat2Y}
              r={blobSize * 0.5}
              fill={hoverBlobColor}
            />
            <motion.circle
              cx={head.x}
              cy={head.y}
              r={blobSize * 0.7}
              fill={hoverBlobColor}
            />
            <motion.circle
              cx={body1.x}
              cy={body1.y}
              r={blobSize * 0.6}
              fill={hoverBlobColor}
            />
            <motion.circle
              cx={body2.x}
              cy={body2.y}
              r={blobSize * 0.5}
              fill={hoverBlobColor}
            />
            <motion.circle
              cx={tail.x}
              cy={tail.y}
              r={blobSize * 0.3}
              fill={hoverBlobColor}
            />
          </motion.g>
        </g>
      </motion.svg>

      <motion.div
        style={{
          ...layerContainerStyle,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
          zIndex: 20,
        }}
      >
        <motion.div
          style={{
            ...imageStyle,
            backgroundImage: `url(${revealImage})`,
            backgroundSize: imageSize ?? objectFit,
            backgroundPosition: imagePosition,
            x: revealX,
            y: revealY,
            scale: 1.1,
          }}
        />
      </motion.div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
};

const layerContainerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  willChange: "transform",
};

