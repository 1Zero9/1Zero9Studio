"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { deleteProjectImage, uploadProjectImage } from "@/lib/blob";
import { prisma } from "@/lib/db";

export async function addProjectMedia(slug: string, formData: FormData) {
  await requireAdminSession();

  const file = formData.get("file");
  const alt = String(formData.get("alt") ?? "").trim();
  if (!(file instanceof File) || file.size === 0 || !alt) {
    throw new Error("An image file and alt text are required.");
  }

  const url = await uploadProjectImage(slug, file);
  const maxOrder = await prisma.projectMedia.aggregate({
    where: { projectSlug: slug },
    _max: { order: true },
  });

  await prisma.projectMedia.create({
    data: { projectSlug: slug, url, alt, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function deleteProjectMedia(slug: string, id: string) {
  await requireAdminSession();

  const media = await prisma.projectMedia.findUnique({ where: { id } });
  if (!media || media.projectSlug !== slug) return;

  await prisma.projectMedia.delete({ where: { id } });
  await deleteProjectImage(media.url);

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function moveProjectMedia(
  slug: string,
  id: string,
  direction: "up" | "down",
) {
  await requireAdminSession();

  const items = await prisma.projectMedia.findMany({
    where: { projectSlug: slug },
    orderBy: { order: "asc" },
  });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index]!;
  const swap = items[swapIndex]!;
  await prisma.$transaction([
    prisma.projectMedia.update({ where: { id: current.id }, data: { order: swap.order } }),
    prisma.projectMedia.update({ where: { id: swap.id }, data: { order: current.order } }),
  ]);

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function addProjectOutcome(slug: string, formData: FormData) {
  await requireAdminSession();

  const text = String(formData.get("text") ?? "").trim();
  if (!text) {
    throw new Error("Outcome text is required.");
  }

  const maxOrder = await prisma.projectOutcome.aggregate({
    where: { projectSlug: slug },
    _max: { order: true },
  });

  await prisma.projectOutcome.create({
    data: { projectSlug: slug, text, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function deleteProjectOutcome(slug: string, id: string) {
  await requireAdminSession();

  await prisma.projectOutcome.deleteMany({ where: { id, projectSlug: slug } });

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function moveProjectOutcome(
  slug: string,
  id: string,
  direction: "up" | "down",
) {
  await requireAdminSession();

  const items = await prisma.projectOutcome.findMany({
    where: { projectSlug: slug },
    orderBy: { order: "asc" },
  });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index]!;
  const swap = items[swapIndex]!;
  await prisma.$transaction([
    prisma.projectOutcome.update({ where: { id: current.id }, data: { order: swap.order } }),
    prisma.projectOutcome.update({ where: { id: swap.id }, data: { order: current.order } }),
  ]);

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function addProjectLink(slug: string, formData: FormData) {
  await requireAdminSession();

  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const kind = String(formData.get("kind") ?? "").trim() || null;
  if (!label || !url) {
    throw new Error("A label and URL are required.");
  }

  const maxOrder = await prisma.projectLink.aggregate({
    where: { projectSlug: slug },
    _max: { order: true },
  });

  await prisma.projectLink.create({
    data: { projectSlug: slug, label, url, kind, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function deleteProjectLink(slug: string, id: string) {
  await requireAdminSession();

  await prisma.projectLink.deleteMany({ where: { id, projectSlug: slug } });

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}

export async function moveProjectLink(
  slug: string,
  id: string,
  direction: "up" | "down",
) {
  await requireAdminSession();

  const items = await prisma.projectLink.findMany({
    where: { projectSlug: slug },
    orderBy: { order: "asc" },
  });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index]!;
  const swap = items[swapIndex]!;
  await prisma.$transaction([
    prisma.projectLink.update({ where: { id: current.id }, data: { order: swap.order } }),
    prisma.projectLink.update({ where: { id: swap.id }, data: { order: current.order } }),
  ]);

  revalidatePath(`/projects/${slug}`);
  revalidatePath(`/admin/projects/${slug}`);
}
