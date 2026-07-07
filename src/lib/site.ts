export const site = {
  name: "1Zero9",
  description:
    "1Zero9 builds bespoke AI systems and custom software — designed around a real problem, not squeezed into a generic tool.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.1zero9.com",
  author: {
    name: "Stephen Cranfield",
    email: "onezeronine@gmail.com",
  },
  nav: [
    { label: "services", href: "/services" },
    { label: "projects", href: "/projects" },
    { label: "writing", href: "/writing" },
    { label: "about", href: "/about" },
  ],
} as const;
