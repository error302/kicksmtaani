"use client";

import { useState } from "react";
import { X, Megaphone } from "lucide-react";

interface Props {
  text: string;
  link?: string;
}

const STORAGE_KEY = "kicksmtaani-announcement-dismissed";

export function AnnouncementBar({ text, link }: Props) {
  // Read sessionStorage only on client (during render is fine because this
  // component is only rendered from a server component that has already
  // confirmed the announcement is active)
  const [dismissed, setDismissed] = useState(false);

  // Use a lazy initializer to read sessionStorage once on first client render
  // — this avoids the setState-in-effect lint error and runs only once.
  const [checked] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored === text;
    } catch {
      return false;
    }
  });

  if (checked || dismissed || !text) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, text);
    } catch {
      // ignore
    }
  };

  const content = (
    <div className="relative bg-foreground text-background py-2.5 px-4 text-center text-xs sm:text-sm font-medium">
      <div className="flex items-center justify-center gap-2 pr-6">
        <Megaphone className="h-3.5 w-3.5 flex-shrink-0" />
        <span>{text}</span>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  if (link) {
    return (
      <a href={link} className="block hover:opacity-90 transition-opacity">
        {content}
      </a>
    );
  }
  return content;
}
