type CraftsmanshipProps = {
  brandName?: string;
  title: string;
  subtitle: string;
  bullets: string[];
};

export function Craftsmanship({
  brandName = 'Sign Foreign Trade',
  title,
  subtitle,
  bullets,
}: CraftsmanshipProps) {
  return (
    <section className="mx-auto grid max-w-5xl grid-cols-1 gap-10 border border-white/10 bg-white/5 px-8 py-12 md:grid-cols-2">
      <div>
        <p className="text-xs uppercase tracking-[0.5em] text-stone-400">{brandName}</p>
        <h3 className="mt-4 text-3xl text-white">{title}</h3>
        <p className="mt-4 text-stone-300">{subtitle}</p>
      </div>
      <div className="space-y-4 text-sm text-stone-300">
        {bullets.map((bullet) => (
          <p key={bullet}>• {bullet}</p>
        ))}
      </div>
    </section>
  );
}
