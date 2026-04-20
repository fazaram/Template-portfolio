"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string | null;
  tags: string[];
}

const ITEMS_PER_PAGE = 6;

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % ITEMS_PER_PAGE) * 0.1, duration: 0.8 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="text-xs font-semibold px-3 py-1 bg-primary/20 backdrop-blur-md text-primary rounded-full break-all">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors break-words">{project.title}</h3>
        <p className="text-muted-foreground mb-6 line-clamp-3 break-words whitespace-pre-wrap">{project.description}</p>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all"
          >
            View Project <ArrowRight size={18} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    const element = document.getElementById("projects");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="projects" className="py-32">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Featured Work
          </motion.h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <div className="min-h-[800px]">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {currentProjects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))}
            </AnimatePresence>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-20 flex justify-center items-center gap-4">
            <button
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-3 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => goToPage(i + 1)}
                  className={`w-12 h-12 rounded-xl font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-3 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
