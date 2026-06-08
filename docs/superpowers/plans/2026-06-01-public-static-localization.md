# Public Static Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize the public website’s static content and UI into EN/TR/AR without touching the live Supabase store translation system.

**Architecture:** Add `_tr` / `_ar` fields to static data, use a shared `getLocalizedField(...)` helper for static-content consumers, expand public UI dictionaries, and keep the current live store translation logic isolated and unchanged.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, existing locale provider, JSON data files

---

### Task 1: Add shared public localization utilities and base RTL/CSS polish

**Files:**
- Create: `src/lib/locale-utils.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] Add `getLocalizedField(item, field, locale)` for `_tr` / `_ar` fallback selection.
- [ ] Add missing public RTL/CSS polish without changing the locale system contract.
- [ ] Add/verify public font handling for Arabic-friendly typography.

### Task 2: Add missing public UI dictionary keys

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/tr.json`
- Modify: `src/i18n/ar.json`

- [ ] Audit missing public UI keys.
- [ ] Add all missing keys needed by public pages/components.
- [ ] Keep existing keys intact and additive only.

### Task 3: Translate static data files

**Files:**
- Modify: `src/data/products.json`
- Modify: `src/data/projects.json`
- Modify: `src/data/stores.json`
- Modify: `src/data/news.json`
- Modify: `src/data/brands.json`
- Modify: `src/data/store-items.ts`

- [ ] Add `_tr` / `_ar` fields for the required content fields only.
- [ ] Preserve all current ids, slugs, image fields, and English source fields.

### Task 4: Update public data consumers to use localized static fields

**Files:**
- Modify relevant public pages/components that render static products/projects/stores/news/brands

- [ ] Replace direct static field reads with `getLocalizedField(...)` where needed.
- [ ] Leave the live Supabase store translation logic untouched.

### Task 5: Finish public responsive optimization

**Files:**
- Modify remaining public pages/components as needed

- [ ] Apply the requested mobile/tablet layout refinements across the remaining public site.
- [ ] Preserve desktop behavior unless a responsive bug requires adjustment.

### Task 6: Verify

**Files:**
- No file changes unless fixes are needed

- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run build`
- [ ] Manually verify EN/TR/AR and RTL on public routes
