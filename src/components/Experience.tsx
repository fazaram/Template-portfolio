"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export default function Experience({ experiences }: { experiences: Experience[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calculate total scroll distance based on experiences
  // We want to show first 2, then scroll the rest.
  // Each card is roughly 250px-300px.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // If we have N experiences, and we show 2 at once.
  // Total distance to scroll the list up is (experiences.length - 2) * cardHeight.
  // We'll use a percentage based transform for flexibility.
  // Fixed distance based on item count to ensure it stops exactly at the last item
  const y = useTransform(scrollYProgress, [0, 1], ["0px", `-${Math.max(0, experiences.length - 2) * 450}px`]);

  if (experiences.length === 0) return null;

  return (
    <section id="experience" ref={containerRef} className="relative" style={{ height: `${experiences.length * 60}vh` }}>
      <div className="sticky top-0 h-screen w-full flex flex-col justify-start overflow-hidden py-32 bg-secondary/30">
        <div className="container mx-auto px-6 mb-20 shrink-0">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Professional Experience
            </motion.h2>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
          </div>
        </div>

        <div className="flex-1 relative w-full overflow-hidden flex justify-center">
          <motion.div 
            style={{ y }} 
            className="w-full max-w-4xl px-6 space-y-12 pb-[30vh] pt-4"
          >
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0.3, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ amount: 0.5 }}
                className="group relative flex gap-8 items-start"
              >
                {/* Simplified Timeline Line & Dot */}
                <div className="flex flex-col items-center shrink-0 pt-3">
                  <div className="w-12 h-12 rounded-2xl bg-background border-2 border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors text-primary shadow-lg">
                    {experiences.length - idx}
                  </div>
                  {idx !== experiences.length - 1 && (
                    <div className="w-0.5 h-32 bg-gradient-to-b from-primary/30 to-transparent mt-4" />
                  )}
                </div>

                <div className="flex-1 pb-12">
                  <div className="bg-card p-8 rounded-[2.5rem] border border-border hover:border-primary/30 transition-all shadow-xl group-hover:shadow-primary/5">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors break-words">
                          {exp.role}
                        </h3>
                        <p className="text-lg font-medium text-muted-foreground font-outfit break-words">
                          {exp.company}
                        </p>
                      </div>
                      <span className="px-4 py-2 bg-secondary rounded-full text-xs font-bold text-primary tracking-wider uppercase border border-border">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
