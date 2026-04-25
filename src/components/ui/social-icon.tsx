"use client";

import { useEffect, useId, useState } from "react";
import { ChevronUp, Eye, FileText, X } from "lucide-react";
import { createPortal } from "react-dom";

import { profileLinks } from "@/lib/profile";
import { cn } from "@/lib/utils";

type ButtonSocialIconDemoProps = {
  className?: string;
  githubHref?: string;
  linkedinHref?: string;
  whatsappHref?: string;
  resumeHref?: string;
};

type SocialItem = {
  href?: string;
  icon: React.ReactNode;
  label: string;
};

export function LinkedInIcon() {
  return (
    <svg aria-hidden="true" className="hero-social-link__icon" viewBox="0 0 24 24">
      <path
        d="M6.94 8.5H3.56V20h3.38V8.5Zm.22-3.56a2.03 2.03 0 1 0-4.06 0 2.03 2.03 0 0 0 4.06 0ZM20.44 13.02c0-3.46-1.85-5.07-4.32-5.07-1.99 0-2.88 1.1-3.38 1.87V8.5H9.36c.05.88 0 11.5 0 11.5h3.38v-6.42c0-.34.02-.68.13-.92.27-.68.88-1.38 1.91-1.38 1.35 0 1.89 1.04 1.89 2.56V20h3.38v-6.98Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg aria-hidden="true" className="hero-social-link__icon" viewBox="0 0 24 24">
      <path
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.5 0-.24-.01-1.04-.01-1.88-2.78.62-3.37-1.21-3.37-1.21-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.08 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.27 9.27 0 0 1 12 6.9c.85 0 1.7.12 2.5.36 1.9-1.33 2.74-1.05 2.74-1.05.56 1.42.21 2.46.11 2.72.64.72 1.03 1.63 1.03 2.75 0 3.95-2.33 4.81-4.56 5.07.36.32.68.95.68 1.92 0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.5A10.24 10.24 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" className="hero-social-link__icon" viewBox="0 0 24 24">
      <path
        d="M12 2.04A9.96 9.96 0 0 0 3.4 16.96L2 22l5.17-1.35A9.96 9.96 0 1 0 12 2.04Zm0 18.1a8.08 8.08 0 0 1-4.12-1.13l-.3-.18-3.07.8.82-2.99-.2-.31a8.09 8.09 0 1 1 6.87 3.81Zm4.44-5.95c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.19-.46-.38-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.57 4.07 3.61.57.25 1.02.4 1.37.51.58.18 1.1.15 1.51.09.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SocialAction({ href, icon, label }: SocialItem) {
  if (href) {
    const isExternal = /^https?:\/\//.test(href);

    return (
      <a
        aria-label={label}
        className="hero-social-link"
        data-cursor="interactive"
        href={href}
        rel={isExternal ? "noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
      >
        {icon}
        <span className="sr-only">{label}</span>
      </a>
    );
  }

  return (
    <button
      aria-label={label}
      className="hero-social-link"
      data-cursor="interactive"
      type="button"
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default function ButtonSocialIconDemo({
  className,
  githubHref = profileLinks.github,
  linkedinHref = profileLinks.linkedin,
  whatsappHref = profileLinks.whatsapp,
  resumeHref = profileLinks.resume,
}: ButtonSocialIconDemoProps) {
  const [expanded, setExpanded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const previewTitleId = useId();

  useEffect(() => {
    if (!isPreviewOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

  const items: SocialItem[] = [
    {
      href: linkedinHref,
      icon: <LinkedInIcon />,
      label: "LinkedIn",
    },
    {
      href: githubHref,
      icon: <GitHubIcon />,
      label: "GitHub",
    },
    {
      href: whatsappHref,
      icon: <WhatsAppIcon />,
      label: "WhatsApp",
    },
  ];

  return (
    <>
      <div className={cn("hero-social-expandable", expanded && "is-expanded", className)}>
        <button
          aria-expanded={expanded}
          aria-label={expanded ? "Close social links" : "Open social links"}
          className="hero-social-toggle"
          data-cursor="interactive"
          onClick={() => setExpanded((v) => !v)}
          type="button"
        >
          <ChevronUp aria-hidden="true" className="hero-social-toggle__icon" strokeWidth={1.5} />
        </button>

        <div
          aria-label="Social links"
          className="hero-social-group"
          role="group"
        >
          {items.map((item) => (
            <SocialAction key={item.label} {...item} />
          ))}
          {resumeHref ? (
            <div className="hero-resume-trigger">
              <a
                aria-label="Download CV"
                className="hero-social-link"
                data-cursor="interactive"
                download
                href={resumeHref}
              >
                <FileText
                  aria-hidden="true"
                  className="hero-social-link__icon"
                  strokeWidth={1.9}
                />
                <span className="sr-only">Download CV</span>
              </a>
              <button
                aria-label="Preview CV"
                className="hero-resume-preview"
                data-cursor="interactive"
                onClick={() => setIsPreviewOpen(true)}
                type="button"
              >
                <Eye aria-hidden="true" className="hero-resume-preview__icon" strokeWidth={1.9} />
                <span className="sr-only">Preview CV</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {isPreviewOpen && resumeHref && typeof document !== "undefined"
        ? createPortal(
        <div
          aria-labelledby={previewTitleId}
          aria-modal="true"
          className="hero-resume-modal"
          role="dialog"
        >
          <button
            aria-label="Close CV preview"
            className="hero-resume-modal__backdrop"
            onClick={() => setIsPreviewOpen(false)}
            type="button"
          />
          <div className="hero-resume-modal__panel">
            <div className="hero-resume-modal__bar">
              <p className="hero-resume-modal__label" id={previewTitleId}>
                CV Preview
              </p>
              <div className="hero-resume-modal__actions">
                <a
                  className="hero-resume-modal__download"
                  data-cursor="interactive"
                  download
                  href={resumeHref}
                >
                  Download
                </a>
                <button
                  aria-label="Close CV preview"
                  className="hero-resume-modal__close"
                  data-cursor="interactive"
                  onClick={() => setIsPreviewOpen(false)}
                  type="button"
                >
                  <X aria-hidden="true" className="hero-resume-modal__close-icon" strokeWidth={1.9} />
                </button>
              </div>
            </div>
            <object
              aria-label="CV preview document"
              className="hero-resume-modal__document"
              data={resumeHref}
              type="application/pdf"
            >
              <div className="hero-resume-modal__fallback">
                <a download href={resumeHref}>
                  Download CV
                </a>
              </div>
            </object>
          </div>
        </div>,
        document.body,
      )
        : null}
    </>
  );
}
