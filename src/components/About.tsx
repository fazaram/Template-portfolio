"use client";

import { motion } from "framer-motion";

interface AboutProps {
  bio: string;
}

export default function About({ bio }: AboutProps) {
  return (
    <section id="about" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Crafting Digital Excellence</h2>
            <div className="w-20 h-1 bg-primary mb-8 rounded-full" />
            <p className="text-xl text-muted-foreground leading-relaxed">
              {bio}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="p-8 bg-card border border-border rounded-3xl text-center">
              <h4 className="text-4xl font-bold text-primary mb-2">5+</h4>
              <p className="text-muted-foreground font-medium">Years Experience</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl text-center mt-6">
              <h4 className="text-4xl font-bold text-primary mb-2">40+</h4>
              <p className="text-muted-foreground font-medium">Projects Done</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl text-center">
              <h4 className="text-4xl font-bold text-primary mb-2">25+</h4>
              <p className="text-muted-foreground font-medium">Happy Clients</p>
            </div>
            <div className="p-8 bg-card border border-border rounded-3xl text-center mt-6">
              <h4 className="text-4xl font-bold text-primary mb-2">12</h4>
              <p className="text-muted-foreground font-medium">Awards Won</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
