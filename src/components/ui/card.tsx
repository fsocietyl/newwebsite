'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('border border-stone-200 bg-white/70 p-6 shadow-sm', className)}
      {...props}
    />
  );
}
