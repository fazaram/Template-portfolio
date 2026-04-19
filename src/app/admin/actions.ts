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
  const profile = await prisma.profile.findFirst();
  if (!profile) throw new Error("Profile not found");

  const avatarFile = formData.get("avatar") as File;
  let avatarUrl = profile.avatarUrl;

  if (avatarFile && avatarFile.size > 0) {
    const newAvatarUrl = await saveFile(avatarFile);
    if (newAvatarUrl) avatarUrl = newAvatarUrl;
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      typingTexts: formData.get("typingTexts") as string,
      email: formData.get("email") as string,
      githubUrl: formData.get("githubUrl") as string,
      linkedinUrl: formData.get("linkedinUrl") as string,
      twitterUrl: formData.get("twitterUrl") as string,
      avatarUrl: avatarUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addProject(formData: FormData) {
  const imageFile = formData.get("image") as File;
  const imageUrl = await saveFile(imageFile);

  if (!imageUrl) throw new Error("Product image is required");

  await prisma.project.create({
    data: {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: imageUrl,
      link: formData.get("link") as string,
      tags: formData.get("tags") as string,
      order: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProject(formData: FormData) {
  const id = formData.get("id") as string;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new Error("Project not found");

  const imageFile = formData.get("image") as File;
  let imageUrl = project.image;

  if (imageFile && imageFile.size > 0) {
    // Delete old image if it's in uploads
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
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: imageUrl,
      link: formData.get("link") as string,
      tags: formData.get("tags") as string,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProject(id: string) {
  const project = await prisma.project.findUnique({ where: { id } });
  if (project?.image.startsWith("/uploads/")) {
    const filePath = join(process.cwd(), "public", project.image);
    try { await unlink(filePath); } catch (e) { console.error("Failed to delete image", e); }
  }

  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addExperience(formData: FormData) {
  // Ensure required fields are present; fallback to empty strings to avoid Prisma validation errors
  const role = (formData.get("role") as string) ?? "";
  const company = (formData.get("company") as string) ?? "";
  const period = (formData.get("period") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";

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
}

export async function updateExperience(formData: FormData) {
  const id = formData.get("id") as string;
  const role = (formData.get("role") as string) ?? "";
  const company = (formData.get("company") as string) ?? "";
  const period = (formData.get("period") as string) ?? "";
  const description = (formData.get("description") as string) ?? "";

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
}

export async function deleteExperience(id: string) {
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin");
}
