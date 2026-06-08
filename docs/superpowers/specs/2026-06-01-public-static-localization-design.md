# Public Static Localization Design

**Goal**

Fully localize the public website's static content and UI into English, Turkish, and Arabic while leaving the live Supabase store backend untouched.

**Decision**

Use two translation layers:

- `src/data/*` static content uses added `_tr` / `_ar` fields
- Live Supabase store keeps its current translation shape and logic

This separation avoids risky refactors in the live store while allowing the rest of the website to become fully localized.

**Scope**

- Public-site responsive optimization for remaining public pages/components
- Public UI translation coverage in `src/i18n/*.json`
- Static content translation in:
  - `src/data/products.json` (`116` items)
  - `src/data/projects.json` (`12` items)
  - `src/data/stores.json` (`8` items)
  - `src/data/news.json` (`10` items)
  - `src/data/brands.json` (`20` items)
  - `src/data/store-items.ts` (legacy static sample data only)
- Locale-aware field selection helper for static-content consumers

**Out of Scope**

- Supabase live store schema or translation shape
- Admin pages
- Form submit logic
- Firestore, seed logic, router behavior, or cart persistence logic

**Architecture**

1. Add a small static-content localization helper, `getLocalizedField(item, field, locale)`, for `_tr` / `_ar` fields.
2. Extend the static data files with translated fields while preserving existing English fields and all ids/slugs.
3. Expand `src/i18n/en.json`, `tr.json`, and `ar.json` with the missing public UI keys only.
4. Update public pages/components to use translation keys for UI strings and `getLocalizedField(...)` for static content values.
5. Preserve existing Arabic direction handling and add only the missing RTL/CSS polish needed for the public site.

**Responsive Strategy**

- Keep desktop behavior where it already works
- Tighten mobile/tablet spacing, type, and section behavior for:
  - home
  - products
  - product detail
  - projects
  - project detail
  - about
  - stores
  - orders
  - contact
  - footer
- Hide or adapt floating elements on detail pages where sticky CTAs take over

**Verification**

- EN / TR / AR render across every public page
- Arabic keeps correct RTL direction
- Static content fields switch by locale via `_tr` / `_ar`
- Live store continues working with its current Supabase translation system
- `npx tsc --noEmit`
- `npm run build`
