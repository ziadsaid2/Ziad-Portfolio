"use client";

import { useEffect, useRef, useState } from "react";

import { useBootReady } from "@/lib/use-boot-ready";

const EXCLUDED_SELECTOR = ".hero-canvas, [data-cursor='exclude']";
const DOT_SMOOTHNESS = 0.2;

export default function SmoothFollower() {
  const bootReady = useBootReady();
  const mousePosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);
  const followerRef = useRef<HTMLDivElement>(null);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncPointerSupport = () => {
      setIsEnabled(mediaQuery.matches);
    };

    syncPointerSupport();
    mediaQuery.addEventListener("change", syncPointerSupport);

    return () => {
      mediaQuery.removeEventListener("change", syncPointerSupport);
    };
  }, []);

  useEffect(() => {
    if (!bootReady || !isEnabled) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(EXCLUDED_SELECTOR)) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }

        return;
      }

      if (!isVisibleRef.current) {
        dotPosition.current = { x: event.clientX, y: event.clientY };
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      mousePosition.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseLeaveWindow = (event: MouseEvent) => {
      if (event.relatedTarget) {
        return;
      }

      isVisibleRef.current = false;
      setIsVisible(false);
    };

    const animate = () => {
      dotPosition.current.x = lerp(
        dotPosition.current.x,
        mousePosition.current.x,
        DOT_SMOOTHNESS,
      );
      dotPosition.current.y = lerp(
        dotPosition.current.y,
        mousePosition.current.y,
        DOT_SMOOTHNESS,
      );

      const follower = followerRef.current;

      if (follower) {
        follower.style.setProperty("--cursor-dot-x", `${dotPosition.current.x}px`);
        follower.style.setProperty("--cursor-dot-y", `${dotPosition.current.y}px`);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeaveWindow);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeaveWindow);
      isVisibleRef.current = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bootReady, isEnabled]);

  if (!bootReady || !isEnabled) {
    return null;
  }

  return (
    <div ref={followerRef} className={`cursor-follower${isVisible ? " is-visible" : ""}`}>
      <div className="cursor-follower__dot" />
    </div>
  );
}
