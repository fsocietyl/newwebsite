'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Slide = {
  title: string;
  description: string;
  image: string;
  link: string;
  ctaKey: string;
};

const slides: Slide[] = [
  {
    title: 'Sign Dış Ticaret Pavilion',
    description: 'Tailored furniture suites curated for penthouses and signature villas.',
    image: '/hero-fresh-1.webp',
    link: '/products',
    ctaKey: 'cta.viewCollections',
  },
  {
    title: 'Sign Dış Ticaret Residences',
    description: 'Studios uniting bespoke craftsmanship and editorial sensibilities.',
    image: '/hero-fresh-2.webp',
    link: '/projects',
    ctaKey: 'cta.exploreBrands',
  },
  {
    title: 'Sign Dış Ticaret Lounge',
    description: 'Residences, resorts, and cultural landmarks created with our studio partners.',
    image: '/hero-fresh-3.webp',
    link: '/projects',
    ctaKey: 'cta.discoverProjects',
  },
  {
    title: 'Sign Dış Ticaret Edition',
    description: 'Curated living spaces refined with bespoke finishes.',
    image: '/hero-fresh-4.webp',
    link: '/projects',
    ctaKey: 'cta.discoverProjects',
  },
  {
    title: 'Sign Dış Ticaret Noir',
    description: 'Signature interiors composed for timeless elegance.',
    image: '/hero-fresh-5.webp',
    link: '/projects',
    ctaKey: 'cta.discoverProjects',
  },
  {
    title: 'Sign Dış Ticaret Signature',
    description: 'Hand-finished details curated for refined living.',
    image: '/hero-fresh-6.webp',
    link: '/projects',
    ctaKey: 'cta.discoverProjects',
  },
  {
    title: 'Sign Dış Ticaret Heritage',
    description: 'Timeless craftsmanship with modern elegance.',
    image: '/hero-fresh-7.webp',
    link: '/projects',
    ctaKey: 'cta.discoverProjects',
  },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [paused]);

  const current = slides[index];

  return (
    <section
      className="w-full bg-black py-10 sm:py-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 md:px-6">
        <div className="flex w-full flex-col gap-4">
          <div className="relative h-[45vh] w-full overflow-hidden rounded-2xl bg-[#050505] md:h-[50vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.image}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-[#c19b4a]/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
