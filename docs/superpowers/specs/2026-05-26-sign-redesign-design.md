# Sign Luxury Redesign Design

**Date:** 2026-05-26

## Goal

Apply the visual language from `/tmp/neww-design` to the public-facing `luxury-living` website while preserving all existing data flow, routing, provider logic, form submission logic, admin pages, and protected files.

## Scope

This redesign applies only to the public website UI:

- Global design tokens and base styling
- Public shell components
- Home, products, product detail
- Store, store detail, cart
- Projects, project detail
- About, stores, orders, contact
- 404 page
- Floating WhatsApp button
- Scroll progress bar

Out of scope:

- Firebase / Firestore / seed logic
- JSON content files
- i18n dictionaries
- admin routes
- route destinations / href changes
- provider behavior
- localStorage cart behavior
- TypeScript model changes

## Reference Design System

The zip prototype establishes this design system:

- Background palette:
  - `--bg-base: #080808`
  - `--bg-surface: #111111`
  - `--bg-elevated: #1a1a1a`
- Accent palette:
  - `--gold: #C9A84C`
  - `--gold-dim: #8B6F2E`
  - `--gold-glow: rgba(201,168,76,0.15)`
  - `--hairline: rgba(245,240,232,0.08)`
- Text:
  - `--text-primary: #F5F0E8`
  - `--text-secondary: #888880`
- Atmosphere:
  - fixed gold grid overlay
  - soft vignette glow
  - thin gold and hairline borders
- Typography:
  - `Cormorant Garamond` for display/headings
  - `Inter` for UI/body
  - small uppercase mono-style utility labels where useful
- Interaction:
  - subtle 3D card tilt
  - slow image zooms on hover
  - scroll-linked reveal and progress indicator
  - strong gold-filled and gold-outline CTA styles

## Mapping To Existing App

### Global

- `styles.css` -> `src/app/globals.css`
- `app-shell.jsx` -> `src/components/layout/header.tsx`, `footer.tsx`, `site-shell.tsx`, `ui/whatsapp-float.tsx`

### Public pages

- `page-home.jsx` -> `src/app/(public)/page.tsx`
- `page-products.jsx` -> `src/app/(public)/products/page.tsx`, `src/components/product-detail-client.tsx`
- `page-store.jsx` -> `src/app/(public)/store/page.tsx`, `src/components/store/store-product-detail.tsx`, `src/app/(public)/store/cart/page.tsx`
- `page-projects.jsx` -> `src/app/(public)/projects/page.tsx`, `src/components/project-detail-client.tsx`
- `page-rest.jsx` -> `src/app/(public)/about/page.tsx`, `stores/page.tsx`, `orders/page.tsx`, `contact/page.tsx`, `src/app/not-found.tsx`

## Architecture

The redesign should be implemented as a visual port, not a structural rewrite of application logic.

1. Keep all existing data and behavior sources intact.
2. Introduce the design system in `globals.css`.
3. Add a reusable `Card3D` component for shared hover depth.
4. Update page JSX and Tailwind classes to reflect the new editorial layout.
5. Preserve current route structure, providers, forms, and content references.

## Component Strategy

### Header

- Sticky, transparent by default
- Becomes blurred dark surface after scroll
- Slim uppercase navigation
- Gold-accent language pills
- Mobile full-screen overlay menu

### Footer

- Three-column editorial footer
- Tagline, nav, contact/social split
- Gold-hover links and subdued secondary text

### Card system

- Reusable `Card3D` wrapper using Framer Motion
- Used for products, stores, related items, and optionally featured project blocks

## Page Designs

### Home

- Replace current hero-slider-driven composition with a scattered editorial product canvas using real product data
- Brand statement section with oversized serif heading and gold italic emphasis
- Scroll-reactive featured project deck using existing project links
- Horizontal stats bar
- Muted logo/brand showcase using existing available content or current brand-adjacent section structure

### Products

- Massive collection headline
- Masonry-style card grid using existing product mapping
- Gold category labels and serif titles

### Product detail

- Split gallery/info layout
- Sticky visual panel
- Gold-accent breadcrumb styling
- Correct breadcrumb route from `/projects` to `/products`
- Accordion presentation for materials/finishes/dimensions while preserving existing content references

### Store

- Same visual language as products, but emphasize price and cart access
- Preserve localStorage cart behavior exactly

### Store detail

- Same split layout as product detail
- Preserve add-to-cart and WhatsApp behavior

### Cart

- Dark editorial summary layout
- Preserve current cart item mapping and checkout URL

### Projects

- Hero with marquee city layer
- Alternating image/info rows
- Scroll reveals only, no route changes

### Project detail

- Full-bleed hero image
- Metadata strip
- Large centered description
- Masonry gallery
- Horizontal related products strip
- Remove the duplicate title/description block while preserving all existing project data references

### About

- Split hero
- Alternating timeline with center gold line
- Stats and quote-driven craftsmanship section

### Stores

- World-map-style hero background recreated in CSS/SVG
- Store cards with luxury card treatment

### Orders

- Preserve the current form logic completely
- Move presentation into a two-panel editorial layout
- Only restyle labels, fields, wrappers, and CTA treatment

### Contact

- Large heading, gold rule, stacked contact rows
- Preserve existing contact data and any current links

### 404

- Minimal centered archival look with gold numeric emphasis

## Constraints

The following files or areas must not be modified except for allowed visual-only changes:

- `src/lib/firestore.ts`
- `src/lib/seed.ts`
- `src/data/*`
- `src/types/content.ts`
- `src/i18n/*`
- provider logic
- admin routes
- link destinations
- router navigation targets
- form submission logic
- cart persistence logic
- `next.config.ts`
- `package.json`

## Validation Requirements

After implementation:

- `npx tsc --noEmit`
- `npm run build`

Also manually verify:

- all page routes still render
- all original `href` values remain unchanged
- all current data variables are still referenced
- Arabic RTL remains intact
- no provider logic was changed

## Risks

- The current repo already has malformed/non-visual changes, especially product seed issues outside the redesign scope.
- Some existing product/project data may not perfectly fit the new editorial layouts.
- Because the zip contains no real image assets or font files, the implementation must rely on Google fonts and existing project images.

## Implementation Recommendation

Implement the redesign in the exact file order requested by the user, beginning with tokens and shell components, then moving page by page. Favor CSS variables and reusable wrappers so the visual language stays consistent without touching application logic.
