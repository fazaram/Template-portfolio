"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { User } from "lucide-react";

interface HeroProps {
  name: string;
  typingTexts: string[];
  avatarUrl?: string | null;
}

export default function Hero({ name, typingTexts, avatarUrl }: HeroProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % typingTexts.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [typingTexts]);

  return (
    <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary opacity-10 blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary opacity-5 blur-[120px] -z-10" />
      
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                {name}
              </h1>
              
              <div className="h-12 flex items-center justify-center md:justify-start">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-xl md:text-3xl text-primary font-bold font-outfit"
                  >
                    {typingTexts[index]}
                  </motion.p>
                </AnimatePresence>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1 h-8 bg-foreground ml-2 rounded-full"
                />
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="mt-12 flex flex-wrap gap-4 justify-center md:justify-start"
              >
                <a
                  href="#contact"
                  className="px-10 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all inline-block"
                >
                  Let's Connect
                </a>
                <a
                  href="#projects"
                  className="px-10 py-4 bg-secondary text-foreground rounded-2xl font-bold border border-border hover:bg-border transition-all inline-block"
                >
                  View Work
                </a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 flex justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 border-2 border-primary/20 rounded-[3rem] rotate-6 animate-pulse" />
              <div className="absolute inset-0 border-2 border-primary/10 rounded-[3rem] -rotate-3" />
              
              <div className="absolute inset-4 bg-card rounded-[2.5rem] overflow-hidden border border-border flex items-center justify-center shadow-2xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                    <User size={80} strokeWidth={1} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
