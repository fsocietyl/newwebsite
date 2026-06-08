'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/components/providers/locale-provider';

type FilterOption = {
  label: string;
  value: string;
};

type FilterProps = {
  id: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
};

type FilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  filters?: FilterProps[];
};

export function FilterBar({ search, onSearchChange, filters = [] }: FilterBarProps) {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-4 border border-white/10 bg-white/5 p-4 md:flex-row md:items-center">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={t('cta.search')}
        className="uppercase"
      />
      <div className="flex flex-1 flex-wrap gap-3">
        {filters.map((filter) => (
          <Select key={filter.id} value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t('cta.filter')}</SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
}
