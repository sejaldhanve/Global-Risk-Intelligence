"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full cursor-pointer bg-[var(--panel-bg)] border border-[var(--panel-border)] text-gray-500 hover:text-white hover:border-[var(--color-cyber-blue-glow)] hover:shadow-[0_0_10px_var(--color-cyber-blue-glow)] transition-all"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-black" />}
    </button>
  );
}
