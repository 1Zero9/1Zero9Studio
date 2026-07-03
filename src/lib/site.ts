export const site = {
  name: "1Zero9",
  description:
    "The digital workshop of Stephen Cranfield — designing and building products where technology becomes useful.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://1zero9.com",
  author: {
    name: "Stephen Cranfield",
    email: "onezeronine@gmail.com",
  },
  nav: [
    { label: "projects", href: "/projects" },
    { label: "writing", href: "/writing" },
    { label: "about", href: "/about" },
  ],
} as const;
