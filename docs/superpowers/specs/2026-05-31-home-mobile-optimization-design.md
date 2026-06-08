# Home Mobile Optimization Design

**Goal**

Improve the homepage experience on phones by making the hero, statement, projects, stats, and brand sections feel intentionally mobile-first instead of compressed desktop layouts.

**Scope**

- Homepage only
- Mobile breakpoints only
- No data, routing, or animation logic changes for desktop

**Approach**

Keep the desktop homepage intact and introduce tighter mobile-specific layout rules inside `src/app/(public)/page.tsx`. The mobile hero becomes a compact editorial stack, the statement section gets smaller typography and less whitespace, the projects area loses sticky/desktop framing on small screens, stats compress into a denser grid, and the brand grid gets smaller cells and spacing.

**Files In Scope**

- `src/app/(public)/page.tsx`

**Verification**

- Check homepage at phone width locally
- Run `npx tsc --noEmit`
- Run `npm run build`
