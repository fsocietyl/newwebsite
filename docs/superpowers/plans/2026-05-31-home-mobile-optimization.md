# Home Mobile Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the homepage feel purpose-built for phones while preserving the existing desktop experience.

**Architecture:** Apply mobile-only layout refinements inside the homepage component. Keep all data sources and desktop structures intact while using smaller spacing, denser grids, and non-sticky mobile flows for the hero, projects, stats, and brand sections.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion

---

### Task 1: Tighten the mobile hero

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Reduce hero top/bottom whitespace on phones.
- [ ] Show a smaller number of lead cards with better stacking density.
- [ ] Reduce card text/chrome footprint on mobile.

### Task 2: Compress the statement section for phones

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Reduce headline size and spacing on mobile.
- [ ] Tighten copy spacing and line length.

### Task 3: Replace desktop-heavy project behavior on phones

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Remove sticky framing effect on mobile.
- [ ] Present project cards in a simple vertical mobile feed.

### Task 4: Densify stats and brand grid on phones

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Make stats a compact 2x2 mobile grid.
- [ ] Reduce brand-card cell height and spacing on phones.

### Task 5: Verify

**Files:**
- No file changes unless fixes are needed

- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run build`
