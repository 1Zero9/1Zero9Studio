
export default [
  {
    "title": "Holiday Concierge",
    "summary": "An AI travel-planning concierge — conversational planning backed by live flight and hotel data, a background job queue, and a human-readable admin console.",
    "date": "2026-01-15",
    "tags": [
      "ai",
      "automation",
      "product"
    ],
    "status": "featured",
    "draft": false,
    "order": 1,
    "content": "## The idea\n\nMost travel tools make you do the work: endless filters, tabs, and\nre-searching. I wanted to test the opposite shape — you describe the trip\nyou're imagining, and a concierge does the legwork, checks real\navailability, and comes back with a considered plan.\n\n## How it works\n\nA conversational planner sits on top of Google's Gemini, but the model is\nonly one component. The system around it does the heavy lifting:\n\n- **Live data** — flight and hotel offers come from the Amadeus APIs, with\n  hotel coverage supplemented through Booking.com. When a provider is\n  unavailable, the system degrades gracefully to clearly-labelled estimates\n  instead of failing or pretending.\n- **Sessions and accounts** — Supabase handles auth and storage across an\n  eight-table schema (profiles, sessions, messages, plans, jobs,\n  notifications, admins, system logs), with row-level security throughout.\n- **A job queue** — longer research tasks run as background jobs processed\n  on a schedule, so the conversation never blocks on a slow search. Users\n  get notified in-app (and by email via Resend) when a plan is ready.\n- **An admin console** — every session, job, and log line is inspectable.\n  An AI system you can't observe is an AI system you can't trust.\n\n## Lessons\n\nThe interesting engineering wasn't the model call — it was everything\naround it: queueing, fallbacks, observability, and knowing when to show an\nhonest estimate instead of a confident guess. Orchestration is the\nproduct.\n\n## Status\n\nBuilt and run as a working system through 2025–26; now retired from the\nlive site as part of this rebuild. The architecture — model + queue +\nlive-data fallbacks + observable admin — is the template I reuse for\nagentic products.",
    "_meta": {
      "filePath": "holiday-concierge/index.mdx",
      "fileName": "index.mdx",
      "directory": "holiday-concierge",
      "extension": "mdx",
      "path": "holiday-concierge"
    },
    "slug": "holiday-concierge",
    "year": "2026",
    "readingTime": 1,
    "mdx": "var Component=(()=>{var u=Object.create;var o=Object.defineProperty;var g=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var p=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var b=(s,e)=>()=>(e||s((e={exports:{}}).exports,e),e.exports),w=(s,e)=>{for(var t in e)o(s,t,{get:e[t],enumerable:!0})},r=(s,e,t,a)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let i of m(e))!f.call(s,i)&&i!==t&&o(s,i,{get:()=>e[i],enumerable:!(a=g(e,i))||a.enumerable});return s};var y=(s,e,t)=>(t=s!=null?u(p(s)):{},r(e||!s||!s.__esModule?o(t,\"default\",{value:s,enumerable:!0}):t,s)),v=s=>r(o({},\"__esModule\",{value:!0}),s);var h=b((x,l)=>{l.exports=_jsx_runtime});var k={};w(k,{default:()=>c});var n=y(h());function d(s){let e={a:\"a\",h2:\"h2\",li:\"li\",p:\"p\",strong:\"strong\",ul:\"ul\",...s.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.h2,{id:\"the-idea\",children:(0,n.jsx)(e.a,{href:\"#the-idea\",children:\"The idea\"})}),`\n`,(0,n.jsx)(e.p,{children:`Most travel tools make you do the work: endless filters, tabs, and\nre-searching. I wanted to test the opposite shape \\u2014 you describe the trip\nyou're imagining, and a concierge does the legwork, checks real\navailability, and comes back with a considered plan.`}),`\n`,(0,n.jsx)(e.h2,{id:\"how-it-works\",children:(0,n.jsx)(e.a,{href:\"#how-it-works\",children:\"How it works\"})}),`\n`,(0,n.jsx)(e.p,{children:`A conversational planner sits on top of Google's Gemini, but the model is\nonly one component. The system around it does the heavy lifting:`}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Live data\"}),` \\u2014 flight and hotel offers come from the Amadeus APIs, with\nhotel coverage supplemented through Booking.com. When a provider is\nunavailable, the system degrades gracefully to clearly-labelled estimates\ninstead of failing or pretending.`]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Sessions and accounts\"}),` \\u2014 Supabase handles auth and storage across an\neight-table schema (profiles, sessions, messages, plans, jobs,\nnotifications, admins, system logs), with row-level security throughout.`]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"A job queue\"}),` \\u2014 longer research tasks run as background jobs processed\non a schedule, so the conversation never blocks on a slow search. Users\nget notified in-app (and by email via Resend) when a plan is ready.`]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"An admin console\"}),` \\u2014 every session, job, and log line is inspectable.\nAn AI system you can't observe is an AI system you can't trust.`]}),`\n`]}),`\n`,(0,n.jsx)(e.h2,{id:\"lessons\",children:(0,n.jsx)(e.a,{href:\"#lessons\",children:\"Lessons\"})}),`\n`,(0,n.jsx)(e.p,{children:`The interesting engineering wasn't the model call \\u2014 it was everything\naround it: queueing, fallbacks, observability, and knowing when to show an\nhonest estimate instead of a confident guess. Orchestration is the\nproduct.`}),`\n`,(0,n.jsx)(e.h2,{id:\"status\",children:(0,n.jsx)(e.a,{href:\"#status\",children:\"Status\"})}),`\n`,(0,n.jsx)(e.p,{children:`Built and run as a working system through 2025\\u201326; now retired from the\nlive site as part of this rebuild. The architecture \\u2014 model + queue +\nlive-data fallbacks + observable admin \\u2014 is the template I reuse for\nagentic products.`})]})}function c(s={}){let{wrapper:e}=s.components||{};return e?(0,n.jsx)(e,{...s,children:(0,n.jsx)(d,{...s})}):d(s)}return v(k);})();\n;return Component;"
  },
  {
    "title": "Learning Through Motion",
    "summary": "A five-week refresh of an education platform — new messaging, new art direction, and a fast Next.js build shipped on a real deadline.",
    "date": "2024-09-01",
    "tags": [
      "design",
      "web",
      "education"
    ],
    "status": "featured",
    "url": "https://learningthroughmotion.vercel.app/",
    "draft": false,
    "order": 3,
    "content": "## The brief\n\nAn education platform that needed to look and read like the quality of\nthe teaching it represented — and needed it in five weeks, not five\nmonths.\n\n## The approach\n\nTight scope, decided early:\n\n- **Messaging first** — before any pixels, the story: who this is for,\n  what changes for them, why it works. Copy drove the design, not the\n  other way round.\n- **Art direction** — a calm, confident visual language appropriate for\n  an education audience; nothing loud, nothing template-shaped.\n- **A fast build** — Next.js with content structured for easy editing,\n  so the platform could keep evolving after handover without a developer\n  in the loop for every change.\n\n## Lessons\n\nFive weeks is enough time to do good work if you spend the first one\ndeciding what *not* to build. The projects that ship on time are the ones\nwhere scope was a design decision, not an accident.",
    "_meta": {
      "filePath": "learning-through-motion/index.mdx",
      "fileName": "index.mdx",
      "directory": "learning-through-motion",
      "extension": "mdx",
      "path": "learning-through-motion"
    },
    "slug": "learning-through-motion",
    "year": "2024",
    "readingTime": 1,
    "mdx": "var Component=(()=>{var p=Object.create;var r=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var u=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var w=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),y=(t,e)=>{for(var i in e)r(t,i,{get:e[i],enumerable:!0})},a=(t,e,i,h)=>{if(e&&typeof e==\"object\"||typeof e==\"function\")for(let o of u(e))!m.call(t,o)&&o!==i&&r(t,o,{get:()=>e[o],enumerable:!(h=f(e,o))||h.enumerable});return t};var v=(t,e,i)=>(i=t!=null?p(g(t)):{},a(e||!t||!t.__esModule?r(i,\"default\",{value:t,enumerable:!0}):i,t)),x=t=>a(r({},\"__esModule\",{value:!0}),t);var s=w((_,d)=>{d.exports=_jsx_runtime});var j={};y(j,{default:()=>l});var n=v(s());function c(t){let e={a:\"a\",em:\"em\",h2:\"h2\",li:\"li\",p:\"p\",strong:\"strong\",ul:\"ul\",...t.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.h2,{id:\"the-brief\",children:(0,n.jsx)(e.a,{href:\"#the-brief\",children:\"The brief\"})}),`\n`,(0,n.jsx)(e.p,{children:`An education platform that needed to look and read like the quality of\nthe teaching it represented \\u2014 and needed it in five weeks, not five\nmonths.`}),`\n`,(0,n.jsx)(e.h2,{id:\"the-approach\",children:(0,n.jsx)(e.a,{href:\"#the-approach\",children:\"The approach\"})}),`\n`,(0,n.jsx)(e.p,{children:\"Tight scope, decided early:\"}),`\n`,(0,n.jsxs)(e.ul,{children:[`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Messaging first\"}),` \\u2014 before any pixels, the story: who this is for,\nwhat changes for them, why it works. Copy drove the design, not the\nother way round.`]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"Art direction\"}),` \\u2014 a calm, confident visual language appropriate for\nan education audience; nothing loud, nothing template-shaped.`]}),`\n`,(0,n.jsxs)(e.li,{children:[(0,n.jsx)(e.strong,{children:\"A fast build\"}),` \\u2014 Next.js with content structured for easy editing,\nso the platform could keep evolving after handover without a developer\nin the loop for every change.`]}),`\n`]}),`\n`,(0,n.jsx)(e.h2,{id:\"lessons\",children:(0,n.jsx)(e.a,{href:\"#lessons\",children:\"Lessons\"})}),`\n`,(0,n.jsxs)(e.p,{children:[`Five weeks is enough time to do good work if you spend the first one\ndeciding what `,(0,n.jsx)(e.em,{children:\"not\"}),` to build. The projects that ship on time are the ones\nwhere scope was a design decision, not an accident.`]})]})}function l(t={}){let{wrapper:e}=t.components||{};return e?(0,n.jsx)(e,{...t,children:(0,n.jsx)(c,{...t})}):c(t)}return x(j);})();\n;return Component;"
  },
  {
    "title": "Park Run Dash",
    "summary": "A 5km side-scrolling running game built with no engine and no framework — just canvas, vanilla JavaScript, and an unreasonable attention to mobile input.",
    "date": "2025-11-01",
    "tags": [
      "games",
      "javascript",
      "experiment"
    ],
    "status": "featured",
    "draft": false,
    "order": 2,
    "content": "## The constraint\n\nBuild a playable game with nothing but a canvas element, vanilla\nJavaScript, and CSS. No engine, no framework, no build step. Three files.\n\nPark Run Dash is a side-scroller themed on the Saturday-morning 5k:\nyou run, you dodge, you try to hold pace to the finish line.\n\n## What it actually took\n\nThe game loop was the easy part. The real work — the part that doesn't\nshow up in a screenshot — was making it feel right on phones:\n\n- **Input** — touch controls with tap fallbacks, because \"works on my\n  desktop keyboard\" is not a control scheme.\n- **Safari** — landscape fullscreen on iOS Safari has its own opinions\n  about viewport units, address bars, and orientation. Winning that fight\n  took more commits than the gameplay did.\n- **Small screens** — maximising the playfield in landscape without\n  clipping the HUD, across an unreasonable range of aspect ratios.\n\n## Lessons\n\nConstraints are clarifying. With no engine to lean on, every frame drawn\nis a decision you made. And shipping something small but *finished* —\nplayable by anyone, on whatever device is in their pocket — teaches you\nmore about the platform than a tutorial ever will.",
    "_meta": {
      "filePath": "park-run-dash/index.mdx",
      "fileName": "index.mdx",
      "directory": "park-run-dash",
      "extension": "mdx",
      "path": "park-run-dash"
    },
    "slug": "park-run-dash",
    "year": "2025",
    "readingTime": 1,
    "mdx": "var Component=(()=>{var u=Object.create;var o=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var g=Object.getPrototypeOf,f=Object.prototype.hasOwnProperty;var y=(t,n)=>()=>(n||t((n={exports:{}}).exports,n),n.exports),w=(t,n)=>{for(var a in n)o(t,a,{get:n[a],enumerable:!0})},s=(t,n,a,r)=>{if(n&&typeof n==\"object\"||typeof n==\"function\")for(let i of m(n))!f.call(t,i)&&i!==a&&o(t,i,{get:()=>n[i],enumerable:!(r=p(n,i))||r.enumerable});return t};var k=(t,n,a)=>(a=t!=null?u(g(t)):{},s(n||!t||!t.__esModule?o(a,\"default\",{value:t,enumerable:!0}):a,t)),b=t=>s(o({},\"__esModule\",{value:!0}),t);var h=y((S,l)=>{l.exports=_jsx_runtime});var x={};w(x,{default:()=>d});var e=k(h());function c(t){let n={a:\"a\",em:\"em\",h2:\"h2\",li:\"li\",p:\"p\",strong:\"strong\",ul:\"ul\",...t.components};return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(n.h2,{id:\"the-constraint\",children:(0,e.jsx)(n.a,{href:\"#the-constraint\",children:\"The constraint\"})}),`\n`,(0,e.jsx)(n.p,{children:`Build a playable game with nothing but a canvas element, vanilla\nJavaScript, and CSS. No engine, no framework, no build step. Three files.`}),`\n`,(0,e.jsx)(n.p,{children:`Park Run Dash is a side-scroller themed on the Saturday-morning 5k:\nyou run, you dodge, you try to hold pace to the finish line.`}),`\n`,(0,e.jsx)(n.h2,{id:\"what-it-actually-took\",children:(0,e.jsx)(n.a,{href:\"#what-it-actually-took\",children:\"What it actually took\"})}),`\n`,(0,e.jsx)(n.p,{children:`The game loop was the easy part. The real work \\u2014 the part that doesn't\nshow up in a screenshot \\u2014 was making it feel right on phones:`}),`\n`,(0,e.jsxs)(n.ul,{children:[`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Input\"}),` \\u2014 touch controls with tap fallbacks, because \"works on my\ndesktop keyboard\" is not a control scheme.`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Safari\"}),` \\u2014 landscape fullscreen on iOS Safari has its own opinions\nabout viewport units, address bars, and orientation. Winning that fight\ntook more commits than the gameplay did.`]}),`\n`,(0,e.jsxs)(n.li,{children:[(0,e.jsx)(n.strong,{children:\"Small screens\"}),` \\u2014 maximising the playfield in landscape without\nclipping the HUD, across an unreasonable range of aspect ratios.`]}),`\n`]}),`\n`,(0,e.jsx)(n.h2,{id:\"lessons\",children:(0,e.jsx)(n.a,{href:\"#lessons\",children:\"Lessons\"})}),`\n`,(0,e.jsxs)(n.p,{children:[`Constraints are clarifying. With no engine to lean on, every frame drawn\nis a decision you made. And shipping something small but `,(0,e.jsx)(n.em,{children:\"finished\"}),` \\u2014\nplayable by anyone, on whatever device is in their pocket \\u2014 teaches you\nmore about the platform than a tutorial ever will.`]})]})}function d(t={}){let{wrapper:n}=t.components||{};return n?(0,e.jsx)(n,{...t,children:(0,e.jsx)(c,{...t})}):c(t)}return b(x);})();\n;return Component;"
  }
]