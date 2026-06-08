# Public Site I18n Design

**Goal**

Make the public-facing website switch cleanly between English, Turkish, and Arabic by removing remaining hardcoded public UI strings and routing them through the existing locale provider and translation dictionaries.

**Scope**

- Public pages and shared public components only
- Existing locale provider and `src/i18n/*.json` dictionaries
- Redesigned home, store, product detail, and shared CTA labels
- No admin localization changes in this pass
- No backend, data model, or routing changes

**Approach**

The codebase already has a working dictionary-based locale system. The gaps are in newer redesigned screens that bypass `useTranslations()` and render English strings directly. This pass will replace those hardcoded public strings with translation keys, add the missing keys to `en.json`, `tr.json`, and `ar.json`, and keep the existing locale-switch behavior intact.

**Files In Scope**

- `src/app/(public)/page.tsx`
- `src/app/(public)/products/new/page.tsx`
- `src/components/store/store-product-detail.tsx`
- `src/components/product-detail-client.tsx`
- `src/components/layout/header.tsx`
- `src/components/ui/whatsapp-float.tsx`
- `src/i18n/en.json`
- `src/i18n/tr.json`
- `src/i18n/ar.json`

**Content To Localize**

- Home hero editorial copy
- Home modal actions and close labels
- Store page hero copy and category/filter labels
- Store card badges and view/detail labels
- Empty-state messages on the store page
- Product detail accordion headings and CTA labels
- Shared WhatsApp labels and accessibility text
- Mobile menu WhatsApp CTA label

**Compatibility Rules**

- Keep current locale detection and persistence behavior unchanged
- Preserve RTL behavior for Arabic
- Do not alter store product data translation logic already added for Supabase-backed products
- Keep all existing links, routes, and click behavior unchanged

**Verification**

- Confirm EN/TR/AR switch changes public text on home, store list, store detail, and product detail
- Confirm Arabic still renders with RTL layout
- Run `npx tsc --noEmit`
- Run `npm run build`
