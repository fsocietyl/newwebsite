# Mobile Floating Hero Design

**Goal**

Make the homepage hero on phones feel like the desktop floating-product canvas instead of a simple stacked card list.

**Scope**

- Homepage hero only
- Mobile breakpoints only
- No changes to desktop hero behavior

**Approach**

Replace the current phone-only stacked product list with a compact floating scene that uses smaller absolute-positioned cards, reduced overlap, and slow drift motion. The scene should preserve tap-to-open behavior and remain readable within roughly the first viewport height on phones.

**Files In Scope**

- `src/app/(public)/page.tsx`

**Behavior**

- Show 4–5 lead products in a phone-specific floating layout
- Keep card tap behavior opening the mini product window
- Preserve the mobile statement text inside the hero
- Prevent cards from covering the main statement block too aggressively
- Keep the rest of the homepage mobile optimization intact

**Verification**

- Check homepage at phone width locally
- Run `npx tsc --noEmit`
- Run `npm run build`
