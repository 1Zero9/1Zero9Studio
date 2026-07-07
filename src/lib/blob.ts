import { del, put } from "@vercel/blob";

export async function uploadProjectImage(slug: string, file: File) {
  const pathname = `projects/${slug}/${Date.now()}-${file.name}`;
  const blob = await put(pathname, file, { access: "public" });
  return blob.url;
}

export async function deleteProjectImage(url: string) {
  await del(url);
}
