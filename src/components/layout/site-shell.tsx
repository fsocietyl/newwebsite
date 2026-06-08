'use client';

import { motion, useScroll } from 'framer-motion';
import { Header } from './header';
import { Footer } from './footer';
import { WhatsAppFloat } from '@/components/ui/whatsapp-float';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <motion.div
        className="fixed left-0 top-0 z-[100] h-px origin-left bg-[var(--gold)]"
        style={{ scaleX: scrollYProgress, width: '100%' }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
