'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-none border transition-all text-sm tracking-[0.2em] uppercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c19b4a] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-[#c19b4a] text-black border-[#c19b4a] hover:bg-[#d6b260]',
        outline: 'bg-transparent border-[#c19b4a] text-[#c19b4a] hover:bg-white/10',
        ghost: 'bg-transparent border-transparent text-[var(--text-secondary)] hover:text-white',
        accent: 'border border-white/30 text-white hover:bg-white hover:text-black',
      },
      size: {
        default: 'px-6 py-3',
        sm: 'px-4 py-2 text-xs',
        lg: 'px-8 py-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';
