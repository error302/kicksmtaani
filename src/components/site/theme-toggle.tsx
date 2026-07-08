"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Theme toggle — dark mode is initialized by an inline script in <head>
 * (see layout.tsx) to prevent flash of wrong theme.
 * This component just toggles the class and persists the choice.
 *
 * Icon visibility is controlled purely by CSS (the `dark` class on <html>),
 * so no React state or effects are needed.
 */
export function ThemeToggle() {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    const next = isDark ? "dark" : "light";
    try {
      localStorage.setItem("kicksmtaani-theme", next);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="hidden sm:inline-flex relative"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
