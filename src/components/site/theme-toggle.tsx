"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

// Theme is initialized by an inline script in <head> (see layout.tsx) before hydration.
// This component just toggles the class and persists the choice.

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Mark mounted on first render to enable interaction
  useState(() => {
    queueMicrotask(() => setMounted(true));
    return 0;
  });

  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    const next = isDark ? "dark" : "light";
    localStorage.setItem("kicksmtaani-theme", next);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="hidden sm:inline-flex relative"
      suppressHydrationWarning
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{mounted ? "Toggle theme" : "Loading"}</span>
    </Button>
  );
}
