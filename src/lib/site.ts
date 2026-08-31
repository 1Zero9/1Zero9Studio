export const site = {
  name: "1Zero9",
  description:
    "The engineering and product portfolio of 1Zero9 Studio — websites, PWAs, software, and active labs experiments designed and built from idea to launch.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.1zero9.com",
  author: {
    name: "1Zero9 Studio",
    email: "onezeronine@gmail.com",
  },
  nav: [
    { label: "Portfolio", href: "/projects" },
    { label: "Labs", href: "/labs" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
} as const;
