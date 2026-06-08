export type StatItem = { label: string; value: string };

export function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <section className="mx-auto my-20 grid max-w-5xl grid-cols-2 gap-8 border border-white/10 bg-white/5 p-10 md:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-4xl font-semibold text-white">{stat.value}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-stone-400">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
