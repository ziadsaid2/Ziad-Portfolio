"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, img, input, textarea, select, label, summary, [role='button'], [data-cursor='interactive']";
const EXCLUDED_SELECTOR = ".hero-canvas, [data-cursor='exclude']";
const DOT_SMOOTHNESS = 0.2;
const BORDER_DOT_SMOOTHNESS = 0.1;

export default function SmoothFollower() {
  const mousePosition = useRef({ x: 0, y: 0 });
  const dotPosition = useRef({ x: 0, y: 0 });
  const borderDotPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [renderPos, setRenderPos] = useState({
    dot: { x: 0, y: 0 },
    border: { x: 0, y: 0 },
  });

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
    if (!isEnabled) return;

    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const updateHoverState = (target: EventTarget | null) => {
      if (!(target instanceof Element)) {
        setIsHovering(false);
        return;
      }

      if (target.closest(EXCLUDED_SELECTOR)) {
        isVisibleRef.current = false;
        setIsVisible(false);
        setIsHovering(false);
        return;
      }

      setIsHovering(Boolean(target.closest(INTERACTIVE_SELECTOR)));
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(EXCLUDED_SELECTOR)) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;
          setIsVisible(false);
        }

        setIsHovering(false);
        return;
      }

      if (!isVisibleRef.current) {
        dotPosition.current = { x: event.clientX, y: event.clientY };
        borderDotPosition.current = { x: event.clientX, y: event.clientY };
        isVisibleRef.current = true;
        setIsVisible(true);
      }

      mousePosition.current = { x: event.clientX, y: event.clientY };
      updateHoverState(event.target);
    };

    const handleMouseLeaveWindow = (event: MouseEvent) => {
      if (event.relatedTarget) {
        return;
      }

      isVisibleRef.current = false;
      setIsVisible(false);
      setIsHovering(false);
    };

    const handleMouseOver = (event: MouseEvent) => {
      updateHoverState(event.target);
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

      borderDotPosition.current.x = lerp(
        borderDotPosition.current.x,
        mousePosition.current.x,
        BORDER_DOT_SMOOTHNESS,
      );
      borderDotPosition.current.y = lerp(
        borderDotPosition.current.y,
        mousePosition.current.y,
        BORDER_DOT_SMOOTHNESS,
      );

      setRenderPos({
        dot: { x: dotPosition.current.x, y: dotPosition.current.y },
        border: { x: borderDotPosition.current.x, y: borderDotPosition.current.y },
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeaveWindow);
    document.addEventListener("mouseover", handleMouseOver);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeaveWindow);
      document.removeEventListener("mouseover", handleMouseOver);
      isVisibleRef.current = false;

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`cursor-follower${isVisible ? " is-visible" : ""}`}>
      <div
        className="cursor-follower__dot"
        style={{
          left: `${renderPos.dot.x}px`,
          top: `${renderPos.dot.y}px`,
        }}
      />

      <div
        className={`cursor-follower__ring${isHovering ? " is-hovering" : ""}`}
        style={{
          left: `${renderPos.border.x}px`,
          top: `${renderPos.border.y}px`,
        }}
      />
    </div>
  );
}
