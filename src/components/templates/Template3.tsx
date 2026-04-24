import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Template3({ profile, projects, experiences }: any) {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950">
      <Navbar logo={profile.name.split(" ")[0]} />
      
      <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
        <Hero 
          name={profile.name} 
          typingTexts={profile.typingTexts.split(";")} 
          avatarUrl={profile.avatarUrl}
        />
      </div>

      <div className="container mx-auto px-6 -mt-32 relative z-10 pb-20">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-8 md:p-16 border border-slate-200 dark:border-slate-800">
           <About 
            bio={profile.bio} 
            yearsExp={profile.yearsExp || "5+"}
            projectsDone={profile.projectsDone || "40+"}
            clientsHappy={profile.clientsHappy || "25+"}
            awardsWon={profile.awardsWon || "12"}
          />
        </div>
      </div>

      <div className="py-24 border-y border-slate-100 dark:border-slate-900">
        <div className="container mx-auto">
          <div className="flex items-center gap-4 px-6 mb-12">
            <div className="h-px bg-primary/20 flex-1" />
            <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-slate-400">Career History</h2>
            <div className="h-px bg-primary/20 flex-1" />
          </div>
          <Experience experiences={experiences} />
        </div>
      </div>

      <div className="py-24 bg-slate-50/50 dark:bg-slate-900/20">
        <Projects projects={projects} />
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800">
        <Contact 
          email={profile.email} 
          github={profile.githubUrl}
          linkedin={profile.linkedinUrl}
          twitter={profile.twitterUrl}
        />
      </div>
      
      <footer className="py-16 border-t border-slate-100 dark:border-slate-900 text-center text-slate-400 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="font-bold text-slate-900 dark:text-white">{profile.name.toUpperCase()}</p>
            <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
            <p className="text-xs uppercase tracking-widest text-primary font-bold">Professional Portfolio</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
