import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Template1({ profile, projects, experiences }: any) {
  return (
    <main className="min-h-screen">
      <Navbar logo={profile.name.split(" ")[0]} />
      <Hero 
        name={profile.name} 
        typingTexts={profile.typingTexts.split(";")} 
        avatarUrl={profile.avatarUrl}
      />
      <About 
        bio={profile.bio} 
        yearsExp={profile.yearsExp || "5+"}
        projectsDone={profile.projectsDone || "40+"}
        clientsHappy={profile.clientsHappy || "25+"}
        awardsWon={profile.awardsWon || "12"}
      />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <Contact 
        email={profile.email} 
        github={profile.githubUrl}
        linkedin={profile.linkedinUrl}
        twitter={profile.twitterUrl}
      />
      
      <footer className="py-12 border-t border-border text-center text-muted-foreground">
        <div className="container mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
