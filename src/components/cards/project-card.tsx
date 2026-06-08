import Image from 'next/image';
import Link from 'next/link';
import type { Project } from '@/types/content';
import { Button } from '@/components/ui/button';
import { useLocale, useTranslations } from '@/components/providers/locale-provider';

export function ProjectCard({ project, href }: { project: Project; href?: string }) {
  const { locale } = useLocale();
  const t = useTranslations();
  const description =
    project.descriptionTranslations?.[locale] ?? project.descriptionTranslations?.en ?? project.description;

  return (
    <div className="border border-white/10 bg-black/40">
      <div className="relative h-56 w-full md:h-72">
        <Image
          src={project.images[0] ?? '/images/placeholder.svg'}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute bottom-0 left-0 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-white md:px-4 md:text-xs md:tracking-[0.4em]">
          {project.city}, {project.country}
        </div>
      </div>
      <div className="px-4 py-5 md:px-5 md:py-6">
        <h3 className="text-xl text-white md:text-2xl">{project.name}</h3>
        <p className="mt-3 text-sm text-stone-300 line-clamp-3">{description}</p>
        <Button asChild variant="ghost" className="mt-4 px-0 text-xs">
          <Link href={href ?? `/projects/${project.slug}`}>{t('cta.projectStory')}</Link>
        </Button>
      </div>
    </div>
  );
}
