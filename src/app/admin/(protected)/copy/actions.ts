"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { copySlots } from "./slots";

export async function saveSiteCopy(formData: FormData) {
  await requireAdminSession();

  for (const slot of copySlots) {
    const raw = formData.get(slot.key);
    if (raw === null) continue;
    const value = String(raw).trim();

    if (value) {
      await prisma.siteCopy.upsert({
        where: { key: slot.key },
        update: { value },
        create: { key: slot.key, value },
      });
    } else {
      await prisma.siteCopy.deleteMany({ where: { key: slot.key } });
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/copy");
}
