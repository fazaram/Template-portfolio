import { prisma } from "@/lib/db";
import AdminForm from "./AdminForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await prisma.profile.findFirst();
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
  });
  const experiences = await prisma.experience.findMany({
    orderBy: { order: "asc" },
  });

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">No Profile Found</h1>
        <p className="text-muted-foreground mb-8">Please visit the home page first to initialize the database.</p>
        <a href="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold">Go Home</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your content and professional identity.</p>
          </div>
          <a href="/" className="text-sm font-bold text-primary hover:underline">View Live Site &rarr;</a>
        </div>
        <AdminForm profile={profile} projects={projects} experiences={experiences} />
      </div>
    </div>
  );
}
