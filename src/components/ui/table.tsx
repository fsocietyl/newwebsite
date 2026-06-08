'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  );
}

const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('text-left text-xs uppercase text-[var(--text-secondary)]', className)} {...props} />
  ),
);
TableHead.displayName = 'TableHead';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn('divide-y divide-white/10', className)} {...props} />
  ),
);
TableBody.displayName = 'TableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn('transition hover:bg-white/5', className)} {...props} />
  ),
);
TableRow.displayName = 'TableRow';

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn('px-3 py-3 text-sm text-[var(--text-primary)]', className)} {...props} />
  ),
);
TableCell.displayName = 'TableCell';

const TableHeaderCell = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th ref={ref} className={cn('px-3 py-2 font-normal tracking-wide text-[var(--text-secondary)]', className)} {...props} />
  ),
);
TableHeaderCell.displayName = 'TableHeaderCell';

export { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell };
