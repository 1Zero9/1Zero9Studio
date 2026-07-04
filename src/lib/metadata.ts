import type { Metadata } from "next";
import { site } from "@/lib/site";

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
};

export function createMetadata({
  title,
  description = site.description,
  path = "/",
  image,
}: CreateMetadataOptions = {}): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    metadataBase: new URL(site.url),
    title: title ? title : { absolute: site.name, template: `%s — ${site.name}` },
    description,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": new URL("/feed.xml", site.url).toString(),
      },
    },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: title ?? site.name,
      description,
      url,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? site.name,
      description,
    },
  };
}
