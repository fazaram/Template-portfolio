import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Template2({ profile, projects, experiences }: any) {
  return (
    <main className="min-h-screen bg-[#020202] text-white selection:bg-primary selection:text-white">
      <Navbar logo={profile.name.split(" ")[0]} />
      
      <div className="relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        
        <div className="pt-20 relative z-10">
          <Hero 
            name={profile.name} 
            typingTexts={profile.typingTexts.split(";")} 
            avatarUrl={profile.avatarUrl}
          />
        </div>
      </div>

      <div className="relative z-10">
        <div className="bg-gradient-to-b from-[#020202] to-[#080808] border-y border-white/5">
          <Projects projects={projects} />
        </div>

        <div className="bg-[#080808]">
          <About 
            bio={profile.bio} 
            yearsExp={profile.yearsExp || "5+"}
            projectsDone={profile.projectsDone || "40+"}
            clientsHappy={profile.clientsHappy || "25+"}
            awardsWon={profile.awardsWon || "12"}
          />
        </div>

        <div className="bg-gradient-to-b from-[#080808] to-[#020202]">
          <Experience experiences={experiences} />
        </div>
        
        <div className="bg-primary/5 py-10">
          <Contact 
            email={profile.email} 
            github={profile.githubUrl}
            linkedin={profile.linkedinUrl}
            twitter={profile.twitterUrl}
          />
        </div>
      </div>
      
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 bg-[#020202]">
        <div className="container mx-auto px-6">
          <p className="text-sm tracking-widest uppercase mb-2">Creative Portfolio</p>
          <p>&copy; {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
