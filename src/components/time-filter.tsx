'use client';

import { Button } from '@/components/ui/button';
import { TimeFilter } from '@/types/cloudflare';
import { Calendar, Clock } from 'lucide-react';

interface TimeFilterProps {
  selectedFilter: TimeFilter;
  onFilterChange: (filter: TimeFilter) => void;
}

const timeFilterOptions: { value: TimeFilter; label: string }[] = [
  { value: '24h', label: 'Últimas 24 horas' },
  { value: '3d', label: 'Últimos 3 dias' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '14d', label: 'Últimos 14 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
];

export function TimeFilter({ selectedFilter, onFilterChange }: TimeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {timeFilterOptions.map((option) => (
        <Button
          key={option.value}
          variant={selectedFilter === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange(option.value)}
          className="flex items-center gap-2"
        >
          <Clock className="h-4 w-4" />
          {option.label}
        </Button>
      ))}
    </div>
  );
} 