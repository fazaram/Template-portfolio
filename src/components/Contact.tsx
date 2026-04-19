"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, TwitterIcon as Twitter } from "lucide-react";

interface ContactProps {
  email: string;
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
}

export default function Contact({ email, github, linkedin, twitter }: ContactProps) {
  return (
    <section id="contact" className="py-32">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Work Together</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            I'm currently opening for new projects and collaborations. If you have an idea in mind, let's talk.
          </p>
          
          <a
            href={`mailto:${email}`}
            className="text-3xl md:text-5xl font-bold text-primary hover:text-primary/70 transition-colors break-all"
          >
            {email}
          </a>

          <div className="flex justify-center gap-8 mt-16">
            {github && (
              <a href={github} className="p-4 bg-secondary rounded-full hover:bg-primary hover:text-white transition-all">
                <Github size={24} />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} className="p-4 bg-secondary rounded-full hover:bg-primary hover:text-white transition-all">
                <Linkedin size={24} />
              </a>
            )}
            {twitter && (
              <a href={twitter} className="p-4 bg-secondary rounded-full hover:bg-primary hover:text-white transition-all">
                <Twitter size={24} />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
