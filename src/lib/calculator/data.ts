export type Tier = {
  id: string;
  name: string;
  setupMin: number;
  setupMax: number;
  monthlyMin: number;
  monthlyMax: number;
  desc: string;
  factors: string[];
};

export type Addon = {
  id: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  qty?: number;
  hasQty?: boolean;
  fixed?: boolean;
  desc: string;
};

export const tiers: Tier[] = [
  {
    id: "foundation",
    name: "Foundation",
    setupMin: 950,
    setupMax: 1500,
    monthlyMin: 35,
    monthlyMax: 50,
    desc: "A clean, custom-designed presence. Up to 5 pages, contact form, basic SEO.",
    factors: [
      "More than 3 pages",
      "Multiple photo galleries or custom graphics",
      "Contact form with routing / email notifications",
      "On-page SEO copywriting included",
      "Bespoke animation or interaction details",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    setupMin: 2000,
    setupMax: 3800,
    monthlyMin: 60,
    monthlyMax: 90,
    desc: "Up to 12 pages, CMS-lite content, bookings/forms, on-page SEO, analytics.",
    factors: [
      "More than 8 pages",
      "Booking or enquiry form with notifications",
      "Custom content sections (news / blog / events)",
      "Multiple integrations (calendar, payments, email)",
      "Heavier custom design system",
    ],
  },
  {
    id: "bespoke",
    name: "Bespoke Platform",
    setupMin: 4500,
    setupMax: 15000,
    monthlyMin: 100,
    monthlyMax: 200,
    desc: "A real web application — database, auth, custom logic, integrations.",
    factors: [
      "User accounts / authentication",
      "Multiple user roles or permissions",
      "Complex database schema (5+ related tables)",
      "Real-time features (live updates, websockets)",
      "Two or more third-party API integrations",
      "Admin dashboard with reporting",
    ],
  },
];

export const addons: Addon[] = [
  {
    id: "page",
    label: "Extra page",
    unit: "one-off",
    min: 120,
    max: 200,
    qty: 1,
    hasQty: true,
    desc: "An additional page beyond your tier's included allowance — e.g. a services page, team bios, or a dedicated landing page for a campaign. Price varies with how much design and content work the page needs.",
  },
  {
    id: "copy",
    label: "Copywriting",
    unit: "one-off · per page",
    min: 60,
    max: 120,
    qty: 1,
    hasQty: true,
    desc: "Professionally written copy for a page, in the client's voice and with basic SEO keywords in mind — so they're not stuck staring at a blank page themselves.",
  },
  {
    id: "logo",
    label: "Logo / brand kit (Canva-based)",
    unit: "one-off",
    min: 150,
    max: 350,
    desc: "A simple logo plus a small brand kit — colours, fonts, a one-page usage guide — built in Canva. Enough for a consistent look across the site and social media, not a full identity system.",
  },
  {
    id: "brand",
    label: "Full brand identity",
    unit: "one-off",
    min: 500,
    max: 1200,
    desc: "A complete brand system: logo, colour palette, typography, and a proper brand guideline document. For a business that needs more than the basics — a step up from the Canva-based kit above.",
  },
  {
    id: "seoaudit",
    label: "Technical SEO audit & setup",
    unit: "one-off",
    min: 300,
    max: 600,
    desc: "A one-off review of site structure, metadata, page speed, and search indexing, with fixes applied. The foundation that needs to be right before ongoing SEO work makes sense.",
  },
  {
    id: "seoongoing",
    label: "Ongoing SEO / content support",
    unit: "monthly",
    min: 150,
    max: 400,
    desc: "Monthly keyword-targeted content updates and technical monitoring to build search rankings over time. This is a slow-build service, not a one-off fix — set expectations accordingly.",
  },
  {
    id: "ecommerce",
    label: "E-commerce module",
    unit: "one-off",
    min: 1500,
    max: 2500,
    desc: "Product catalogue, shopping cart, and Stripe checkout added to the site, for a client who wants to sell online. Price scales with product count and complexity (variants, shipping rules, etc.).",
  },
  {
    id: "booking",
    label: "Booking / scheduling system",
    unit: "one-off",
    min: 600,
    max: 1200,
    desc: "A booking or appointment system built into the site, with automated confirmation emails via Resend. Good fit for clinics, clubs, or service businesses that take appointments.",
  },
  {
    id: "feature",
    label: "Custom feature / integration",
    unit: "one-off",
    min: 300,
    max: 1000,
    desc: "Any bespoke functionality outside the standard build — a calculator, a member portal, a third-party API connection. This is a placeholder line: scope the real price per feature before quoting.",
  },
  {
    id: "domain",
    label: "Domain registration (.ie / .com)",
    unit: "annual (yr 1 + renewal)",
    min: 10,
    max: 15,
    desc: "Registering the client's domain on their behalf via LetsHost.ie, renewed annually. The .ie extension carries more trust with Irish customers than .com.",
  },
  {
    id: "email",
    label: "Professional email — per mailbox",
    unit: "monthly + €50 one-off setup / mailbox",
    min: 6.9,
    max: 6.9,
    qty: 1,
    hasQty: true,
    fixed: true,
    desc: "A branded mailbox (name@theirdomain.ie) via Google Workspace, so the client isn't sending business emails from a personal Gmail account. Priced at cost — this is a pass-through, not a markup.",
  },
  {
    id: "priority",
    label: "Priority / same-day support upgrade",
    unit: "monthly",
    min: 40,
    max: 40,
    fixed: true,
    desc: "Bumps response time on the care plan to same-day, for clients who can't wait the standard few days for small changes. A fixed add-on, not a range.",
  },
  {
    id: "training",
    label: "Training / handover session",
    unit: "one-off · per hour",
    min: 80,
    max: 80,
    qty: 1,
    hasQty: true,
    fixed: true,
    desc: "A session teaching the client to make their own basic content edits — swapping images, updating text — so they're not paying you for every small tweak. Billed hourly.",
  },
  {
    id: "migration",
    label: "Site migration (from Wix/WordPress/Squarespace)",
    unit: "one-off",
    min: 400,
    max: 1000,
    desc: "Moving an existing site's content — pages, images, blog posts — into the new custom build. Price depends on how much content there is and how messy the source site is.",
  },
];

export function fmt(n: number) {
  return "€" + n.toLocaleString("en-IE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function fmt2(n: number) {
  return "€" + n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
