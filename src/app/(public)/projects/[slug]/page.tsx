import { seedProducts, seedProjects } from '@/lib/seed';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ProjectDetailClient } from '@/components/project-detail-client';
import { normalizeSlug, slugify } from '@/lib/slug';

export const dynamic = 'force-static';

export function generateStaticParams() {
  const params = seedProjects.flatMap((project) => {
    const base = (project.slug ?? '').trim().toLowerCase();
    const nameSlug = slugify(project.name ?? '');
    return [base, nameSlug].filter(Boolean).map((slug) => ({ slug }));
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const target = normalizeSlug(slug);
  const project = seedProjects.find(
    (item) => normalizeSlug(item.slug) === target || normalizeSlug(item.name) === target,
  );
  if (!project) return {};
  return {
    title: project.name,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const project = seedProjects.find(
    (item) => normalizeSlug(item.slug) === normalizedSlug || normalizeSlug(item.name) === normalizedSlug,
  );
  if (!project) return notFound();

  const related = seedProducts.filter((product) => project.relatedProductSlugs?.includes(product.slug));

  return <ProjectDetailClient project={project} related={related} slug={slug} />;
}
