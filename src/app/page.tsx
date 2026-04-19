import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    let profile = await prisma.profile.findFirst();
    let projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    let experiences = await prisma.experience.findMany({
      orderBy: { order: "desc" },
    });

    // Seed/Init if empty
    if (!profile) {
       profile = await prisma.profile.create({
        data: {
          name: "Alex Rivera",
          role: "Full-Stack Developer",
          bio: "I craft high-performance digital solutions that combine cutting-edge technology with aesthetic design.",
          email: "hello@alexrivera.dev",
          typingTexts: "Building the future of the web.;Designing seamless experiences.;Turning ideas into reality.",
          githubUrl: "https://github.com",
          linkedinUrl: "https://linkedin.com",
        },
      });
    }

    return {
      profile,
      projects: projects.map((p: any) => ({
        ...p,
        tags: typeof p.tags === 'string' ? p.tags.split(";") : p.tags,
      })),
      experiences,
    };
  } catch (error) {
    console.warn("Database error, using mock data.", error);
    return {
      profile: { 
        name: "Alex Rivera", 
        role: "Dev", 
        bio: "", 
        email: "hello@alexrivera.dev", 
        typingTexts: "Mock Text", 
        avatarUrl: null,
        githubUrl: null,
        linkedinUrl: null,
        twitterUrl: null
      },
      projects: [],
      experiences: [],
    };
  }
}

export default async function Home() {
  const { profile, projects, experiences } = await getData();

  return (
    <main className="min-h-screen">
      <Navbar logo={profile!.name.split(" ")[0]} />
      <Hero 
        name={profile!.name} 
        typingTexts={profile!.typingTexts.split(";")} 
        avatarUrl={profile!.avatarUrl}
      />
      <About bio={profile!.bio} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Contact 
        email={profile!.email} 
        github={profile!.githubUrl}
        linkedin={profile!.linkedinUrl}
        twitter={profile!.twitterUrl}
      />
      
      <footer className="py-12 border-t border-border text-center text-muted-foreground">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} {profile!.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
