"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir, unlink } from "node:fs/promises";
import { join } from "node:path";

async function saveFile(file: File) {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Simple optimization: could use sharp here, but keeping it native for simplicity as requested
  // "Optimization" here means creating unique filenames to prevent cache issues
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const path = join(process.cwd(), "public/uploads", fileName);

  await writeFile(path, buffer);
  return `/uploads/${fileName}`;
}

export async function updateProfile(formData: FormData) {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) return { error: "Profile not found" };

    const avatarFile = formData.get("avatar") as File;
    let avatarUrl = profile.avatarUrl;

    if (avatarFile && avatarFile.size > 0) {
      const newAvatarUrl = await saveFile(avatarFile);
      if (newAvatarUrl) avatarUrl = newAvatarUrl;
    }

    const formatStat = (val: string) => {
      if (!val) return "";
      const trimmed = val.trim();
      if (trimmed.length > 5) throw new Error("Statistics must be 5 chars or less");
      if (!/^\d+$/.test(trimmed)) throw new Error("Statistics must contain digits only");
      return `${trimmed}+`;
    };

    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const bio = formData.get("bio") as string;
    const typingTexts = formData.get("typingTexts") as string;
    const email = formData.get("email") as string;

    if (name.length > 30) throw new Error("Name must be 30 chars or less");
    if (role.length > 50) throw new Error("Role must be 50 chars or less");
    if (bio.length > 255) throw new Error("Bio must be 255 chars or less");
    if (typingTexts.length > 255) throw new Error("Typing texts must be 255 chars or less");
    if (email.length > 30) throw new Error("Email must be 30 chars or less");

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        name,
        role,
        bio,
        typingTexts,
        email,
        githubUrl: formData.get("githubUrl") as string,
        linkedinUrl: formData.get("linkedinUrl") as string,
        twitterUrl: formData.get("twitterUrl") as string,
        yearsExp: formatStat(formData.get("yearsExp") as string),
        projectsDone: formatStat(formData.get("projectsDone") as string),
        clientsHappy: formatStat(formData.get("clientsHappy") as string),
        awardsWon: formatStat(formData.get("awardsWon") as string),
        avatarUrl: avatarUrl,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function addProject(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;

    if (title.length > 50) throw new Error("Title must be 50 chars or less");
    if (description.length > 255) throw new Error("Description must be 255 chars or less");
    if (tags.length > 100) throw new Error("Tags must be 100 chars or less");

    const imageFile = formData.get("image") as File;
    const imageUrl = await saveFile(imageFile);

    if (!imageUrl) throw new Error("Product image is required");

    await prisma.project.create({
      data: {
        title,
        description,
        image: imageUrl,
        link: formData.get("link") as string,
        tags,
        order: 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function updateProject(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const tags = formData.get("tags") as string;

    if (title.length > 50) throw new Error("Title must be 50 chars or less");
    if (description.length > 255) throw new Error("Description must be 255 chars or less");
    if (tags.length > 100) throw new Error("Tags must be 100 chars or less");

    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new Error("Project not found");

    const imageFile = formData.get("image") as File;
    let imageUrl = project.image;

    if (imageFile && imageFile.size > 0) {
      if (project.image.startsWith("/uploads/")) {
        const oldPath = join(process.cwd(), "public", project.image);
        try { await unlink(oldPath); } catch (e) {}
      }
      const newImageUrl = await saveFile(imageFile);
      if (newImageUrl) imageUrl = newImageUrl;
    }

    await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        image: imageUrl,
        link: formData.get("link") as string,
        tags,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function deleteProject(id: string) {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (project?.image.startsWith("/uploads/")) {
      const filePath = join(process.cwd(), "public", project.image);
      try { await unlink(filePath); } catch (e) { console.error("Failed to delete image", e); }
    }

    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function addExperience(formData: FormData) {
  try {
    const role = (formData.get("role") as string) ?? "";
    const company = (formData.get("company") as string) ?? "";
    const period = (formData.get("period") as string) ?? "";
    const description = (formData.get("description") as string) ?? "";

    if (role.length > 50) throw new Error("Role must be 50 chars or less");
    if (company.length > 50) throw new Error("Company must be 50 chars or less");
    if (description.length > 255) throw new Error("Description must be 255 chars or less");

    await prisma.experience.create({
      data: {
        role,
        company,
        period,
        description,
        order: 0,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function updateExperience(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const role = (formData.get("role") as string) ?? "";
    const company = (formData.get("company") as string) ?? "";
    const period = (formData.get("period") as string) ?? "";
    const description = (formData.get("description") as string) ?? "";

    if (role.length > 50) throw new Error("Role must be 50 chars or less");
    if (company.length > 50) throw new Error("Company must be 50 chars or less");
    if (description.length > 255) throw new Error("Description must be 255 chars or less");

    await prisma.experience.update({
      where: { id },
      data: {
        role,
        company,
        period,
        description,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function deleteExperience(id: string) {
  try {
    await prisma.experience.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "An unexpected error occurred" };
  }
}

export async function reorderProjects(ids: string[]) {
  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.project.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save project order" };
  }
}

export async function reorderExperiences(ids: string[]) {
  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.experience.update({
          where: { id },
          data: { order: index },
        })
      )
    );
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to save experience order" };
  }
}
