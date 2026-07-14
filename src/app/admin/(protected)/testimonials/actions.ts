"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function revalidate() {
  revalidatePath("/");
  revalidatePath("/admin/testimonials");
}

export async function addTestimonial(formData: FormData) {
  await requireAdminSession();

  const quote = String(formData.get("quote") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim() || null;
  const projectSlug = String(formData.get("projectSlug") ?? "").trim() || null;
  if (!quote || !author) {
    throw new Error("A quote and author are required.");
  }

  const maxOrder = await prisma.testimonial.aggregate({ _max: { order: true } });

  await prisma.testimonial.create({
    data: { quote, author, role, projectSlug, order: (maxOrder._max.order ?? -1) + 1 },
  });

  revalidate();
}

export async function deleteTestimonial(id: string) {
  await requireAdminSession();

  await prisma.testimonial.deleteMany({ where: { id } });

  revalidate();
}

export async function toggleTestimonialPublished(id: string) {
  await requireAdminSession();

  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) return;

  await prisma.testimonial.update({
    where: { id },
    data: { published: !testimonial.published },
  });

  revalidate();
}

export async function moveTestimonial(id: string, direction: "up" | "down") {
  await requireAdminSession();

  const items = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  const index = items.findIndex((item) => item.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= items.length) return;

  const current = items[index]!;
  const swap = items[swapIndex]!;
  await prisma.$transaction([
    prisma.testimonial.update({ where: { id: current.id }, data: { order: swap.order } }),
    prisma.testimonial.update({ where: { id: swap.id }, data: { order: current.order } }),
  ]);

  revalidate();
}
