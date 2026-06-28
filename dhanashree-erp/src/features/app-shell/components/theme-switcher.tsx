"use client";

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const themes = [
  { icon: Sun, label: "Light", value: "light" },
  { icon: Moon, label: "Dark", value: "dark" },
  { icon: Laptop, label: "System", value: "system" },
] as const;

export function ThemeSwitcher() {
  const { setTheme, theme = "system" } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button aria-label="Theme" disabled size="icon" variant="ghost">
        <Laptop />
      </Button>
    );
  }

  const currentIndex = themes.findIndex((item) => item.value === theme);
  const currentTheme = themes[currentIndex] ?? themes[2];
  const Icon = currentTheme.icon;

  return (
    <Button
      aria-label={`Theme: ${currentTheme.label}`}
      size="icon"
      type="button"
      variant="ghost"
      onClick={() => {
        const nextTheme =
          themes[(currentIndex + 1) % themes.length] ?? themes[0];
        setTheme(nextTheme.value);
      }}
    >
      <Icon />
    </Button>
  );
}
