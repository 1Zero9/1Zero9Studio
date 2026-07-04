import { ogImage, ogSize } from "@/lib/og";
import { allWriting, getPost } from "@/lib/content";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Writing";

export function generateStaticParams() {
  return allWriting.map((post) => ({ slug: post.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  return ogImage({
    title: post?.title ?? "Writing",
    subtitle: post?.summary,
  });
}
