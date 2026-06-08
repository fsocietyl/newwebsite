import Image from 'next/image';

export function GlobalPresence() {
  return (
    <section className="mx-auto mt-16 max-w-6xl border border-stone-200 bg-white/70 px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-stone-500">Global Presence</p>
          <p className="mt-4 text-stone-600">
            Private salons and flagship galleries in 8 countries with project ateliers supporting
            architects and interior designers.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-stone-500">
            <li>Istanbul — Signature Atelier</li>
            <li>London — Townhouse Gallery</li>
            <li>Dubai — Regional Hub</li>
            <li>New York — Trade Loft</li>
          </ul>
        </div>
        <div className="relative h-64 w-full">
          <Image src="/images/world-map.svg" alt="World map" fill sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
      </div>
    </section>
  );
}
