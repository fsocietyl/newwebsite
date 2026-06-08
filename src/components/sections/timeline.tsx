export type TimelineEntry = { year?: string; title: string; description: string };

export function Timeline({
  brandName = 'Sign Foreign Trade',
  entries,
}: {
  brandName?: string;
  entries: TimelineEntry[];
}) {
  return (
    <section className="mx-auto max-w-4xl space-y-4">
      {entries.map((item) => (
        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h4 className="text-xl text-white">{item.title}</h4>
          <p className="mt-2 text-sm text-stone-300">
            {item.description.replace('{{brand}}', brandName)}
          </p>
        </div>
      ))}
    </section>
  );
}
