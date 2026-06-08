# Public Site I18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make all redesigned public-site UI text switch correctly across English, Turkish, and Arabic using the existing locale system.

**Architecture:** Reuse the current locale provider and JSON dictionaries. Replace remaining hardcoded public strings with translation lookups, add missing keys to the dictionaries, and keep routing, data fetching, and store-product translation behavior unchanged.

**Tech Stack:** Next.js 16, React 19, TypeScript, existing locale provider, JSON dictionaries

---

### Task 1: Audit and localize redesigned public dictionary gaps

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/tr.json`
- Modify: `src/i18n/ar.json`

- [ ] Add missing keys for redesigned home/store/product UI copy and shared CTA/accessibility labels.
- [ ] Keep keys grouped by existing sections where possible (`cta`, `storePage`, `sections`, `status`) and add a small new grouping if needed for home/store hero strings.
- [ ] Ensure all three dictionaries have the same key shape.

### Task 2: Wire the home page to translations

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Replace hardcoded home hero copy with `useTranslations()` keys.
- [ ] Replace home product modal button labels and close text with translation keys.
- [ ] Keep current motion/layout behavior unchanged.

### Task 3: Wire the store listing page to translations

**Files:**
- Modify: `src/app/(public)/products/new/page.tsx`

- [ ] Replace hardcoded hero title/subtitle labels with translation keys.
- [ ] Replace category chip labels such as `All`, card badges such as `New Arrival`, and empty-state copy with translation keys.
- [ ] Keep the new category filtering behavior intact.

### Task 4: Wire shared product/store detail UI to translations

**Files:**
- Modify: `src/components/store/store-product-detail.tsx`
- Modify: `src/components/product-detail-client.tsx`

- [ ] Replace hardcoded CTA labels and accordion headings with translation keys.
- [ ] Preserve existing locale-aware store-product content resolution for Supabase-backed products.

### Task 5: Wire shared header/WhatsApp labels to translations

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/ui/whatsapp-float.tsx`

- [ ] Replace remaining public hardcoded WhatsApp/menu text and accessibility labels with translation keys.
- [ ] Preserve locale switching and mobile-menu behavior.

### Task 6: Verify public locale switching

**Files:**
- No file changes required unless fixes are needed

- [ ] Run `npx tsc --noEmit`
- [ ] Run `npm run build`
- [ ] Manually verify EN/TR/AR on `/`, `/store`, `/store/[slug]`, and `/products/[slug]`
