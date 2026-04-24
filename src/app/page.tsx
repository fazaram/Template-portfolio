import { prisma } from "@/lib/db";
import Template1 from "@/components/templates/Template1";
import Template2 from "@/components/templates/Template2";
import Template3 from "@/components/templates/Template3";

export const dynamic = "force-dynamic";

async function getData() {
  try {
    let profile = await prisma.profile.findFirst();
    let projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
    });
    let experiences = await prisma.experience.findMany({
      orderBy: { order: "asc" },
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
          selectedTemplate: "template1",
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
        twitterUrl: null,
        yearsExp: "5+",
        projectsDone: "40+",
        clientsHappy: "25+",
        awardsWon: "12",
        selectedTemplate: "template1"
      },
      projects: [],
      experiences: [],
    };
  }
}

export default async function Home() {
  const { profile, projects, experiences } = await getData();

  const props = { profile, projects, experiences };

  switch (profile?.selectedTemplate) {
    case "template2":
      return <Template2 {...props} />;
    case "template3":
      return <Template3 {...props} />;
    default:
      return <Template1 {...props} />;
  }
}
