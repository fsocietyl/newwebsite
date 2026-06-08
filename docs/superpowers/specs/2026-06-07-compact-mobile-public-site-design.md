# Compact Mobile Public Site Design

## Summary

Make the entire public site feel more compact and smaller on phones while preserving the current desktop visual direction and existing backend, data, routing, admin, and store logic. The goal is not a redesign. The goal is a dense, intentional mobile presentation that keeps the luxury aesthetic but removes oversized spacing, tall sections, large card chrome, and desktop-biased proportions on narrow screens.

## Scope

This pass applies only to the public-facing site:

- `src/app/(public)/*`
- shared public layout components such as header, footer, floating WhatsApp, and public detail components
- global public styling in `src/app/globals.css`

This pass does **not** change:

- admin pages
- Firebase or Supabase logic
- translations, data models, or route structure
- form submit behavior

## Goals

- Make the public site feel consistently tighter on phones, not only the homepage
- Reduce perceived scale on phone widths so the site matches the user’s preferred compact aesthetic
- Preserve the desktop/tablet look unless a phone-specific adjustment requires a small shared breakpoint refinement
- Keep the current floating-product identity on the homepage, including the mobile floating canvas variant already chosen

## Non-Goals

- No new visual direction
- No new content sections
- No data or i18n refactor
- No admin-side responsive work
- No rebuilding desktop layouts from scratch

## Recommended Approach

Apply a global compact-mobile pass across the public site. Use smaller phone-only spacing, reduced typography at the smallest breakpoints, shorter hero heights, tighter card padding, reduced modal and CTA chrome, and denser section flow. Keep tablet and desktop behavior mostly unchanged.

This is the safest option because it improves the entire phone experience consistently without destabilizing the desktop work the user already approved.

## Design Rules

### Global phone density

At phone widths:

- reduce section top/bottom padding
- reduce container side padding where safe
- shorten tall hero/intro sections
- reduce card padding and border chrome footprint
- reduce headline and metadata sizes where they currently dominate the viewport
- reduce gaps between stacked blocks
- keep touch targets usable even while making the interface visually smaller

### Breakpoint intent

- Phone: prioritize compactness first
- Tablet: keep the current layouts readable with only light tightening
- Desktop: preserve existing composition

## Area-by-Area Design

### Header

- Keep the existing structure and behavior
- Reduce mobile header height
- Tighten logo footprint, menu button size, and language pill spacing
- Reduce overlay menu padding and item gaps so the mobile menu feels less oversized

### Homepage

#### Hero

- Keep the mobile floating canvas, but make it denser
- Reduce scene height
- Reduce floating card dimensions
- Reduce overlap dead space so more of the composition is visible at first paint
- Shrink supporting type and modal chrome on mobile

#### Brand statement

- Reduce heading size and line spacing on phones
- Tighten gap between heading and paragraph
- Reduce paragraph width and vertical whitespace

#### Projects section

- Keep the simplified mobile flow already introduced
- Reduce card padding, text size, and vertical gaps
- Tighten section spacing before and after the project feed

#### Stats and logos

- Keep the mobile grid structures already introduced
- Reduce number size, label size, and gaps
- Reduce logo cell height and outer margins

### Products and Store listing pages

- Reduce hero height and title scale on phones
- Tighten category/filter chip spacing and scroll area padding
- Reduce card padding, labels, titles, price spacing, and CTA footprint
- Keep images readable but shorten overly tall card proportions on phones

### Product and Store detail pages

- Reduce hero image height on phones
- Tighten info panel padding
- Reduce accordion spacing and title scale
- Reduce thumbnail size and gap
- Keep sticky mobile CTA behavior, but reduce button height and surrounding spacing so it occupies less vertical space

### Cart

- Keep the current mobile stack
- Reduce card padding, text size, and gaps
- Tighten the sticky checkout area footprint on mobile

### Projects list and project detail

- Reduce hero heights and title overlays on phones
- Tighten metadata rows and description spacing
- Reduce related-product card footprint
- Reduce gallery gaps where possible without harming readability

### About, Stores, Contact, Privacy, Terms, 404

- Reduce vertical whitespace between sections
- Reduce heading scale on phone widths
- Tighten cards, contact rows, store info blocks, and legal-page padding
- Preserve readability while removing dead space

### Footer and WhatsApp FAB

- Reduce footer padding, title sizes, and block spacing on phones
- Slightly reduce FAB size and offset on mobile while keeping it tappable

## Implementation Notes

- Prefer mobile-first class adjustments in existing components rather than structural rewrites
- Use smaller `gap`, `space-y`, `px`, `py`, `min-h`, `text-*`, and `max-w-*` values at phone breakpoints
- Preserve current desktop classes where possible and override only the smallest breakpoint behavior
- Avoid changing logic, routes, or data access

## Verification

Check the public site locally at representative phone widths:

- 375px
- 390px

Verify these pages specifically:

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

Success criteria:

- no horizontal overflow
- noticeably denser phone layouts across the whole public site
- desktop remains visually consistent with the current approved direction
- floating homepage products remain readable and visible on phones
