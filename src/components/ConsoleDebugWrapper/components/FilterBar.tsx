import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  logCounts: Record<string, number>;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
  logCounts,
  onClearFilters,
}) => {
  const filters = [
    { key: 'all', label: 'All', color: 'bg-gray-100 text-gray-800' },
    { key: 'log', label: 'Log', color: 'bg-blue-100 text-blue-800' },
    { key: 'error', label: 'Error', color: 'bg-red-100 text-red-800' },
    { key: 'warn', label: 'Warn', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'info', label: 'Info', color: 'bg-green-100 text-green-800' },
    { key: 'debug', label: 'Debug', color: 'bg-purple-100 text-purple-800' },
  ];

  const hasActiveFilters = searchTerm || activeFilter !== 'all';

  return (
    <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/20">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
        <Input
          placeholder="Search logs..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-7 h-7 text-xs border-border focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-1">
        <Filter className="w-3 h-3 text-muted-foreground" />
        <div className="flex items-center gap-1">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange(filter.key)}
              className={`h-6 px-2 text-xs ${
                activeFilter === filter.key
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {filter.label}
              {logCounts[filter.key] > 0 && (
                <Badge
                  variant="secondary"
                  className={`ml-1 h-4 px-1 text-xs ${
                    activeFilter === filter.key
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : filter.color
                  }`}
                >
                  {logCounts[filter.key]}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
