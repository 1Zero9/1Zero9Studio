import { ogImage, ogSize } from "@/lib/og";
import { allProjects, getProject } from "@/lib/content";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Project";

export function generateStaticParams() {
  return allProjects.map((project) => ({ slug: project.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return ogImage({
    title: project?.title ?? "Project",
    subtitle: project?.summary,
  });
}
