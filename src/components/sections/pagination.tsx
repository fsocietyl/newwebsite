'use client';

import { Button } from '@/components/ui/button';

type PaginationProps = {
  page: number;
  total: number;
  onChange: (next: number) => void;
};

export function Pagination({ page, total, onChange }: PaginationProps) {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  if (total <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {pages.map((index) => (
        <Button
          key={index}
          variant={index === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(index)}
        >
          {index}
        </Button>
      ))}
    </div>
  );
}
