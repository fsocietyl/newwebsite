'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'w-full border border-white/20 bg-white/5 px-4 py-2 text-sm tracking-wide uppercase text-white placeholder:text-[var(--text-secondary)] focus:border-[#c19b4a] focus:outline-none focus:ring-0',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';
