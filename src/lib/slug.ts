export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const normalizeSlug = (value?: string) => (value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

export const getSafeProjectSlug = (
  project: { slug?: string | null; name?: string | null },
  projects?: { slug?: string | null }[],
) => {
  const raw = (project.slug ?? '').trim().toLowerCase();
  const nameSlug = slugify(project.name ?? '');
  if (!raw) return nameSlug;
  if (!projects) return raw;
  const duplicates = projects.filter((item) => (item.slug ?? '').trim().toLowerCase() === raw).length;
  if (duplicates > 1 && nameSlug) return nameSlug;
  return raw;
};
