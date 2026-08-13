export const site = {
  name: "1Zero9",
  description:
    "The product portfolio of Stephen Cranfield — websites, PWA apps and software designed and built from idea to launch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.1zero9.com",
  author: {
    name: "Stephen Cranfield",
    email: "onezeronine@gmail.com",
  },
  nav: [
    { label: "Work", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Notes", href: "/writing" },
  ],
} as const;
