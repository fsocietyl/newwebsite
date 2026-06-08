# Mobile Floating Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the phone homepage hero stack with a true floating product canvas that resembles the desktop version.

**Architecture:** Keep the desktop floating scene unchanged. Introduce a separate phone-only floating hero layout in the homepage component using a small mobile position map and lightweight drift animation, while preserving tap-to-open and the existing mini product modal.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion

---

### Task 1: Add a mobile floating position map

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Define a compact phone-specific card position set.
- [ ] Limit the mobile scene to 4–5 products.

### Task 2: Replace the stacked mobile hero

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Remove the plain phone card stack.
- [ ] Render mobile cards in an absolute-positioned floating scene.
- [ ] Preserve tap-to-open behavior and product naming.

### Task 3: Keep the mobile statement readable

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Keep the statement inside the hero.
- [ ] Ensure cards do not overwhelm the copy block.

### Task 4: Verify

**Files:**
- No file changes unless fixes are needed

- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run build`
