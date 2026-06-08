'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'flex h-4 w-4 items-center justify-center border border-[var(--gold-border)] bg-[rgba(201,168,76,0.08)] text-[var(--gold)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--gold)]',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="text-[var(--gold)]">
      <Check className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;
