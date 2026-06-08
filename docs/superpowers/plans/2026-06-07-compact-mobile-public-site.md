# Compact Mobile Public Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the public site feel noticeably more compact and smaller on phones while preserving the current desktop and backend behavior.

**Architecture:** Apply a mobile-only density pass across the existing public components instead of redesigning layouts or changing logic. The work stays inside public pages, shared public layout/detail components, and global styles, using smaller phone breakpoints for spacing, type, section heights, cards, and sticky CTAs.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion, existing locale/provider setup

---

## File Structure

### Primary files to modify

- `src/app/globals.css`
  - Global phone-density helpers, overflow protections, compact mobile section spacing, and small-screen utility refinements.
- `src/components/layout/header.tsx`
  - Smaller mobile header height, logo footprint, overlay spacing, and language/menu chrome.
- `src/components/layout/footer.tsx`
  - Tighter phone spacing and single-column compact footer presentation.
- `src/components/ui/whatsapp-float.tsx`
  - Smaller mobile FAB size and offset.
- `src/app/(public)/page.tsx`
  - Compact mobile homepage hero, brand statement, projects feed, stats, logos, and modal spacing.
- `src/app/(public)/products/page.tsx`
  - Tighter mobile product hero, filter area, and card density.
- `src/components/product-detail-client.tsx`
  - Smaller phone gallery/info spacing and tighter sticky WhatsApp CTA.
- `src/app/(public)/store/page.tsx`
  - Tighter mobile store hero, category chips, and product card density.
- `src/components/store/store-product-detail.tsx`
  - Smaller phone gallery/info spacing and tighter sticky CTA footprint.
- `src/app/(public)/store/cart/page.tsx`
  - Compact phone cart cards and smaller checkout bar footprint.
- `src/app/(public)/projects/page.tsx`
  - Smaller phone hero, stacked project rows, and tighter metadata/copy spacing.
- `src/components/project-detail-client.tsx`
  - Smaller phone hero height, tighter metadata row, description, gallery, and related products.
- `src/app/(public)/about/page.tsx`
  - Compact phone hero split, timeline spacing, and section density.
- `src/app/(public)/stores/page.tsx`
  - Tighter phone grid spacing and smaller card/info blocks.
- `src/app/(public)/contact/page.tsx`
  - Compact phone contact rows and reduced whitespace.
- `src/app/(public)/privacy/page.tsx`
  - Smaller phone legal-page spacing and type.
- `src/app/(public)/terms/page.tsx`
  - Smaller phone legal-page spacing and type.
- `src/app/not-found.tsx`
  - Smaller phone 404 typography and spacing.

### Verification files/pages to inspect manually

- `/`
- `/products`
- `/products/[slug]`
- `/store`
- `/store/[slug]`
- `/store/cart`
- `/projects`
- `/projects/[slug]`
- `/about`
- `/stores`
- `/contact`
- `/privacy`
- `/terms`
- `/not-found`

---

### Task 1: Tighten global phone density rules

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add compact mobile base rules**

Update `src/app/globals.css` with mobile-only rules for:

```css
html,
body {
  overflow-x: hidden;
}

@media (max-width: 639px) {
  body {
    font-size: 14px;
  }

  main {
    overflow-x: clip;
  }
}
```

Also add or refine compact mobile utility targets for section spacing, dense containers, and smaller legal/body copy where the current global styles are oversized.

- [ ] **Step 2: Keep global changes non-destructive**

Do not alter desktop typography tokens or rewrite existing theme variables. Restrict new rules to phone breakpoints and existing public selectors only.

- [ ] **Step 3: Run typecheck to ensure no accidental syntax break**

Run: `cd /home/spacewalker/Desktop/webnew/luxury-living && npx tsc --noEmit`

Expected: `Process exits successfully with no TypeScript errors`

- [ ] **Step 4: Commit the global density pass**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git add src/app/globals.css
git commit -m "style: tighten global mobile density"
```

### Task 2: Compact shared public chrome on phones

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/components/ui/whatsapp-float.tsx`

- [ ] **Step 1: Tighten the mobile header**

In `src/components/layout/header.tsx`, reduce only small-screen values for:

```tsx
className="h-14 px-4 sm:px-6 lg:h-auto lg:px-12"
className="text-[10px] tracking-[0.18em] sm:text-[11px]"
className="size-9 sm:size-10"
className="gap-3 sm:gap-4"
```

Apply the same idea to the mobile overlay: smaller top padding, smaller vertical link gaps, smaller language pill spacing, unchanged behavior.

- [ ] **Step 2: Tighten the mobile footer**

In `src/components/layout/footer.tsx`, reduce phone-only spacing:

```tsx
className="px-4 py-10 sm:px-6 sm:py-12 lg:px-12 lg:py-16"
className="gap-6 sm:gap-8 lg:gap-12"
className="text-xs sm:text-sm"
```

Keep tablet/desktop layout structure intact.

- [ ] **Step 3: Reduce mobile WhatsApp FAB footprint**

In `src/components/ui/whatsapp-float.tsx`, use smaller mobile dimensions:

```tsx
className="bottom-4 right-4 h-11 w-11 sm:bottom-6 sm:right-4 sm:h-12 sm:w-12 lg:bottom-8 lg:right-8 lg:h-14 lg:w-14"
```

Do not change its logic or desktop behavior.

- [ ] **Step 4: Verify shared public chrome locally**

Run: `cd /home/spacewalker/Desktop/webnew/luxury-living && npm run build`

Expected: `Next.js production build completes successfully`

- [ ] **Step 5: Commit shared chrome changes**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git add src/components/layout/header.tsx src/components/layout/footer.tsx src/components/ui/whatsapp-float.tsx
git commit -m "style: compact shared public mobile chrome"
```

### Task 3: Compact the homepage on phones

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] **Step 1: Tighten the mobile floating hero**

In `src/app/(public)/page.tsx`, reduce phone-only hero metrics:

```tsx
className="min-h-[72svh] sm:min-h-[80svh] lg:min-h-screen"
className="w-[128px] sm:w-[148px] lg:w-[220px]"
className="rounded-xl sm:rounded-2xl"
className="p-3 sm:p-4 lg:p-6"
```

Keep the floating scene and tap-to-open behavior unchanged.

- [ ] **Step 2: Tighten homepage copy and section spacing**

Reduce phone-only spacing and type in the brand statement, project feed, stats, logos, and modal:

```tsx
className="py-12 sm:py-16 lg:py-32"
className="text-[clamp(2rem,10vw,4.5rem)]"
className="gap-4 sm:gap-6 lg:gap-10"
className="p-4 sm:p-5 lg:p-8"
```

Do not remove any sections or desktop interactions.

- [ ] **Step 3: Verify the homepage at phone widths**

Run local dev if needed and inspect:

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
npm run dev
```

Check `/` at 375px and 390px.

Expected:
- floating cards are smaller and more visible at first paint
- no large empty vertical gaps
- statement/projects/stats/logos read as denser phone layouts

- [ ] **Step 4: Commit homepage compacting**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git add 'src/app/(public)/page.tsx'
git commit -m "style: compact mobile homepage"
```

### Task 4: Compact product and store listing pages on phones

**Files:**
- Modify: `src/app/(public)/products/page.tsx`
- Modify: `src/app/(public)/store/page.tsx`

- [ ] **Step 1: Tighten listing-page heroes and filter rows**

Reduce phone-only hero height, title scale, and chip spacing in both files:

```tsx
className="pb-6 pt-20 sm:pb-8 sm:pt-24 lg:pb-12"
className="text-[clamp(2rem,9vw,7.5rem)]"
className="gap-2 sm:gap-3"
className="px-3 py-1.5 sm:px-4 sm:py-2"
```

- [ ] **Step 2: Tighten mobile product/store cards**

Reduce phone-only card padding, text scale, and image proportions while keeping readability:

```tsx
className="p-3 sm:p-4 lg:p-5"
className="text-sm sm:text-base lg:text-lg"
className="aspect-[4/3] sm:aspect-[4/5]"
```

Keep all existing links, category logic, hover/tap behavior, and data access intact.

- [ ] **Step 3: Verify list pages locally**

Check these routes at 375px and 390px:
- `/products`
- `/store`

Expected:
- denser hero and category section
- visibly smaller cards
- no horizontal overflow

- [ ] **Step 4: Commit listing-page changes**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git add 'src/app/(public)/products/page.tsx' 'src/app/(public)/store/page.tsx'
git commit -m "style: compact mobile product and store listings"
```

### Task 5: Compact product, store detail, and cart pages on phones

**Files:**
- Modify: `src/components/product-detail-client.tsx`
- Modify: `src/components/store/store-product-detail.tsx`
- Modify: `src/app/(public)/store/cart/page.tsx`

- [ ] **Step 1: Tighten detail-page phone layouts**

Reduce phone-only image height, thumb size, info spacing, and sticky CTA footprint in both detail components:

```tsx
className="h-[42svh] sm:h-[50svh] lg:h-screen"
className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
className="p-4 sm:p-6 lg:p-12"
className="py-3 text-xs sm:py-4 sm:text-sm"
```

- [ ] **Step 2: Tighten the mobile cart**

In `src/app/(public)/store/cart/page.tsx`, reduce card padding, gaps, image size, and sticky checkout bar height:

```tsx
className="gap-3 sm:gap-4"
className="w-14 h-14 sm:w-16 sm:h-16"
className="py-3.5 text-xs sm:py-5 sm:text-sm"
```

Keep cart logic and checkout behavior unchanged.

- [ ] **Step 3: Verify detail and cart routes**

Check:
- `/products/[slug]`
- `/store/[slug]`
- `/store/cart`

Expected:
- smaller gallery/info presentation
- smaller sticky CTAs
- no clipped content above the sticky action areas

- [ ] **Step 4: Commit detail/cart mobile changes**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git add src/components/product-detail-client.tsx src/components/store/store-product-detail.tsx 'src/app/(public)/store/cart/page.tsx'
git commit -m "style: compact mobile detail and cart pages"
```

### Task 6: Compact projects and about/stores/contact/legal pages on phones

**Files:**
- Modify: `src/app/(public)/projects/page.tsx`
- Modify: `src/components/project-detail-client.tsx`
- Modify: `src/app/(public)/about/page.tsx`
- Modify: `src/app/(public)/stores/page.tsx`
- Modify: `src/app/(public)/contact/page.tsx`
- Modify: `src/app/(public)/privacy/page.tsx`
- Modify: `src/app/(public)/terms/page.tsx`
- Modify: `src/app/not-found.tsx`

- [ ] **Step 1: Tighten the projects list and detail views**

Reduce phone-only hero heights, metadata spacing, description gaps, and related-product footprint:

```tsx
className="h-[32svh] sm:h-[40svh] lg:h-[50vh]"
className="gap-4 sm:gap-6 lg:gap-8"
className="px-4 py-4 sm:px-6 sm:py-6 lg:px-12"
className="min-w-[68vw] sm:min-w-[75vw]"
```

- [ ] **Step 2: Tighten about, stores, and contact**

Reduce phone-only section padding and content spacing:

```tsx
className="py-12 sm:py-16 lg:py-24"
className="gap-4 sm:gap-6 lg:gap-10"
className="text-[clamp(1.8rem,8vw,4rem)]"
```

Preserve current structure and all localized content.

- [ ] **Step 3: Tighten legal pages and 404**

In `privacy`, `terms`, and `not-found`, reduce phone-only padding and display scale so these pages no longer feel oversized on narrow screens.

- [ ] **Step 4: Verify remaining public pages**

Check:
- `/projects`
- `/projects/[slug]`
- `/about`
- `/stores`
- `/contact`
- `/privacy`
- `/terms`
- `/not-found`

Expected:
- visibly denser mobile layouts
- preserved readability
- no overflow or large dead space

- [ ] **Step 5: Commit remaining page compaction**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git add 'src/app/(public)/projects/page.tsx' src/components/project-detail-client.tsx 'src/app/(public)/about/page.tsx' 'src/app/(public)/stores/page.tsx' 'src/app/(public)/contact/page.tsx' 'src/app/(public)/privacy/page.tsx' 'src/app/(public)/terms/page.tsx' src/app/not-found.tsx
git commit -m "style: compact remaining public mobile pages"
```

### Task 7: Final verification pass

**Files:**
- Verify only

- [ ] **Step 1: Run full typecheck**

Run:

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
npx tsc --noEmit
```

Expected: `TypeScript exits successfully`

- [ ] **Step 2: Run production build**

Run:

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
npm run build
```

Expected: `Next.js build completes successfully`

- [ ] **Step 3: Do final phone-width QA**

Check the full public route list at:
- `375px`
- `390px`

Expected:
- no horizontal scroll
- the whole public site feels smaller and denser on phones
- desktop/tablet behavior remains visually aligned with the current approved direction

- [ ] **Step 4: Commit final verification checkpoint**

```bash
cd /home/spacewalker/Desktop/webnew/luxury-living
git status
```

Expected: `Only intended mobile-compaction files remain changed or all changes are committed`
