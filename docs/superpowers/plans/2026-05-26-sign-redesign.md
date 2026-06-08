# Sign Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the `/tmp/neww-design` luxury visual system across the public-facing `luxury-living` website without changing protected logic, routing targets, data sources, providers, admin pages, or cart persistence behavior.

**Architecture:** Introduce the redesign as a visual layer only. Global tokens and typography live in `src/app/globals.css` and `src/app/layout.tsx`; shared shell behavior is updated in header/footer/site shell and the WhatsApp FAB; public pages are restyled route by route while preserving the existing data variables, `Link` destinations, and form handlers. Visual depth and consistency come from a reusable `Card3D` component and shared utility classes rather than logic changes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion

---

### File Map

**Create**
- `src/components/ui/card-3d.tsx`

**Modify**
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/footer.tsx`
- `src/components/layout/site-shell.tsx`
- `src/components/ui/whatsapp-float.tsx`
- `src/app/(public)/page.tsx`
- `src/app/(public)/products/page.tsx`
- `src/components/product-detail-client.tsx`
- `src/app/(public)/store/page.tsx`
- `src/components/store/store-product-detail.tsx`
- `src/app/(public)/store/cart/page.tsx`
- `src/app/(public)/projects/page.tsx`
- `src/components/project-detail-client.tsx`
- `src/app/(public)/about/page.tsx`
- `src/app/(public)/stores/page.tsx`
- `src/app/(public)/orders/page.tsx`
- `src/components/forms/custom-order-form.tsx`
- `src/app/(public)/contact/page.tsx`
- `src/app/not-found.tsx`

**Verify**
- `npx tsc --noEmit`
- `npm run build`

### Task 1: Global Tokens And Fonts

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] Add design tokens, overlays, typography helpers, surface utilities, button styles, divider styles, footer/header helpers, FAB styles, and marquee/progress utility classes in `src/app/globals.css`.
- [ ] Import `Cormorant Garamond` and `Inter` through `next/font/google` in `src/app/layout.tsx` and wire them into the existing CSS custom properties used by the app.
- [ ] Preserve current RTL behavior by keeping Arabic font overrides in `globals.css`.

### Task 2: Shared Visual Infrastructure

**Files:**
- Create: `src/components/ui/card-3d.tsx`
- Modify: `src/components/layout/site-shell.tsx`
- Modify: `src/components/ui/whatsapp-float.tsx`

- [ ] Create a reusable Framer Motion `Card3D` wrapper that only changes presentation and hover behavior.
- [ ] Add a scroll progress bar to `site-shell.tsx` using `useScroll`, ensuring existing shell structure and children placement remain intact.
- [ ] Restyle the WhatsApp floating button to match the gold circular pulse treatment without changing the underlying link destination.

### Task 3: Header And Footer

**Files:**
- Modify: `src/components/layout/header.tsx`
- Modify: `src/components/layout/footer.tsx`

- [ ] Rebuild the header into the redesign’s transparent-to-blurred sticky shell while preserving current navigation hrefs, locale behavior, and mobile menu state logic.
- [ ] Restyle the footer into the three-column editorial layout while preserving current contact data and external links.

### Task 4: Home Page

**Files:**
- Modify: `src/app/(public)/page.tsx`

- [ ] Replace the current hero composition with a scattered product canvas using the existing `products` array and existing asset URLs.
- [ ] Add the brand statement section, featured projects deck, stats bar, and muted project/brand showcase treatment while preserving current project link logic and data usage.

### Task 5: Products And Product Detail

**Files:**
- Modify: `src/app/(public)/products/page.tsx`
- Modify: `src/components/product-detail-client.tsx`

- [ ] Restyle the products index into the large-heading masonry layout using `Card3D` while preserving current product mapping.
- [ ] Rebuild the product detail page into the split gallery/info layout with accordion presentation.
- [ ] Fix the visual breadcrumb target from `/projects` to `/products` without altering any unrelated routing behavior.

### Task 6: Store, Store Detail, Cart

**Files:**
- Modify: `src/app/(public)/store/page.tsx`
- Modify: `src/components/store/store-product-detail.tsx`
- Modify: `src/app/(public)/store/cart/page.tsx`

- [ ] Restyle the store index with pricing emphasis and persistent cart badge while preserving localStorage cart reads.
- [ ] Restyle the store detail view to match the product detail split layout, preserving add-to-cart and WhatsApp actions.
- [ ] Restyle the cart page into the editorial summary layout while preserving the existing cart item mapping and checkout href.

### Task 7: Projects And Project Detail

**Files:**
- Modify: `src/app/(public)/projects/page.tsx`
- Modify: `src/components/project-detail-client.tsx`

- [ ] Rebuild the projects index with the marquee hero and alternating rows, preserving existing safe slug link generation.
- [ ] Restyle the project detail page into the hero/meta/gallery/related strip layout.
- [ ] Remove the duplicate title/description block from the project detail component while keeping the remaining data references intact.

### Task 8: About, Stores, Orders, Contact, 404

**Files:**
- Modify: `src/app/(public)/about/page.tsx`
- Modify: `src/app/(public)/stores/page.tsx`
- Modify: `src/app/(public)/orders/page.tsx`
- Modify: `src/components/forms/custom-order-form.tsx`
- Modify: `src/app/(public)/contact/page.tsx`
- Modify: `src/app/not-found.tsx`

- [ ] Rebuild the about page into the split hero, timeline, stats, and quote sections using existing translated content.
- [ ] Restyle the stores page into the world-map hero and card grid using current store data and map links.
- [ ] Rebuild the orders page into the two-panel editorial layout while preserving the current custom order submit logic.
- [ ] Restyle the form fields in `custom-order-form.tsx` using visual-only class changes.
- [ ] Rebuild the contact page into the large-heading contact row layout.
- [ ] Restyle the 404 page into the minimal gold archival layout while keeping the home link.

### Task 9: Verification

**Files:**
- Verify only

- [ ] Run `npx tsc --noEmit` and fix any type errors introduced by the visual refactor.
- [ ] Run `npm run build` and fix any build issues introduced by the redesign.
- [ ] Manually re-check that current hrefs, providers, form handlers, and RTL support remain intact in the edited files.
