"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar({ logo }: { logo: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <nav className="fixed top-0 w-full z-50 py-6 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
          {logo.toUpperCase()}.DEV
        </Link>
        <div className="hidden md:flex items-center gap-10 font-medium">
          <a href="#about" className="hover:text-primary transition-colors">About</a>
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <LayoutDashboard size={18} /> Admin
          </Link>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-full border border-border hover:border-primary hover:text-primary transition-all duration-300"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
}
