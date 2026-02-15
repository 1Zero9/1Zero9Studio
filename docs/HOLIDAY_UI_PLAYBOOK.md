# Holiday Agent UI Playbook

## Purpose
Keep a consistent, premium look and feel across all Holiday Agent pages without repeating one-off UI decisions.

## Core Principles
- One visual family across pages.
- Unique accent per page, same structural language.
- Mobile-first readability before visual flair.
- Prefer reusable classes over long per-page utility strings.

## Shared Building Blocks
Defined in `src/app/globals.css`:
- `ha-page`: standard page background + spacing.
- `ha-hero`: primary hero container.
- `ha-orb-1`, `ha-orb-2`, `ha-orb-3`: ambient hero glow layers.
- `ha-panel`: standard card/panel.
- `ha-panel-soft`: lighter panel.
- `ha-kpi`: compact metrics card.
- `ha-chip`: compact metadata badge.
- `ha-btn-primary`: primary action button.
- `ha-btn-secondary`: secondary action button.

Defined in `src/components/holiday-agent/ui.tsx`:
- `HolidayPageShell`
- `HolidayHero`
- `HolidayPanel`
- `HolidayPrimaryButton`
- `HolidaySecondaryButton`

Theme tokens:
- `src/components/holiday-agent/theme.ts`
- Use `holidayThemes.<pageId>` for accent text classes.

## Page Identity (Accent Only)
- Planner: emerald + teal accents.
- Concierge: emerald + fuchsia accents.
- Hub: neutral + emerald direction.
- Admin: amber + slate operational style.

## Layout Rules
- Header/Hero first, controls second, results third.
- On desktop: primary controls left, optional controls right.
- On mobile: stack panels in priority order with clear section headers.
- Keep primary CTA visible without scrolling when feasible.

## Interaction Rules
- Show clear disabled states for all async actions.
- Never show raw provider errors directly when user-facing copy can be friendlier.
- For long result details, default to summarized view and allow expand/collapse.

## Future Project Starter Checklist
- Add/confirm shared classes in global stylesheet first.
- Start from `src/components/holiday-agent/NewPageTemplate.tsx`.
- Validate at 390px, 768px, 1280px breakpoints before launch.
- Add one short UX review pass before API integration.
