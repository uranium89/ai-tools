'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';

import '@/lib/utils';
import { ToolFilters, AccessLevel, ToolCategory } from '@/types/ai-tools';
import { useAIToolStore } from '@/lib/store/ai-tools-store';
import { TOOL_CATEGORIES } from '@/lib/data/mock-tools';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetClose,
  SheetFooter
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface FilterOption<T> {
  id: T;
  label: string;
}

const ACCESS_LEVELS: FilterOption<AccessLevel>[] = [
  { id: 'free', label: 'Free' },
  { id: 'freemium', label: 'Freemium' },
  { id: 'paid', label: 'Paid' },
  { id: 'enterprise', label: 'Enterprise' },
];

export function ToolFiltersComponent() {
  const { filters, setFilters } = useAIToolStore();
  const [tempFilters, setTempFilters] = useState<ToolFilters>({ ...filters });
  const [isOpen, setIsOpen] = useState(false);

  // Count active filters
  const activeFilterCount = (
    (filters.categories?.length || 0) +
    (filters.accessLevels?.length || 0) +
    (filters.tags?.length || 0) +
    (filters.hasApi !== undefined ? 1 : 0) +
    (filters.minRating !== undefined ? 1 : 0)
  );

  const handleCategoryChange = (category: ToolCategory, checked: boolean) => {
    setTempFilters(prev => {
      const categories = prev.categories || [];
      if (checked) {
        return { ...prev, categories: [...categories, category] };
      } else {
        return { ...prev, categories: categories.filter(c => c !== category) };
      }
    });
  };

  const handleAccessLevelChange = (level: AccessLevel, checked: boolean) => {
    setTempFilters(prev => {
      const accessLevels = prev.accessLevels || [];
      if (checked) {
        return { ...prev, accessLevels: [...accessLevels, level] };
      } else {
        return { ...prev, accessLevels: accessLevels.filter(l => l !== level) };
      }
    });
  };

  const handleApiChange = (checked: boolean) => {
    setTempFilters(prev => ({ ...prev, hasApi: checked ? true : undefined }));
  };

  const handleSortChange = (sortBy: 'popularity' | 'rating' | 'newest' | 'name') => {
    setTempFilters(prev => ({ ...prev, sortBy }));
  };

  const handleReset = () => {
    setTempFilters({});
  };

  const handleApply = () => {
    setFilters(tempFilters);
    setIsOpen(false);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // When opening, set temp filters to current filters
      setTempFilters({ ...filters });
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1 min-w-4 h-4 text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter AI Tools</SheetTitle>
            </SheetHeader>
            <div className="py-4 h-[calc(100vh-10rem)] overflow-auto">
              <div className="space-y-5">
                {/* Categories Section */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {TOOL_CATEGORIES.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`}
                          checked={tempFilters.categories?.includes(category.id)}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category.id, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`category-${category.id}`}
                          className="text-sm"
                        >
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Access Level Section */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Access Level</h3>
                  <div className="space-y-2">
                    {ACCESS_LEVELS.map((level) => (
                      <div key={level.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`access-${level.id}`}
                          checked={tempFilters.accessLevels?.includes(level.id)}
                          onCheckedChange={(checked) => 
                            handleAccessLevelChange(level.id, checked === true)
                          }
                        />
                        <Label 
                          htmlFor={`access-${level.id}`}
                          className="text-sm"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                {/* Other Filters */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Additional Filters</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="api-available"
                        checked={tempFilters.hasApi === true}
                        onCheckedChange={(checked) => handleApiChange(checked === true)}
                      />
                      <Label 
                        htmlFor="api-available"
                        className="text-sm"
                      >
                        API Available
                      </Label>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Sorting Options */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Sort By</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={tempFilters.sortBy === 'popularity' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSortChange('popularity')}
                    >
                      Popularity
                    </Button>
                    <Button 
                      variant={tempFilters.sortBy === 'rating' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSortChange('rating')}
                    >
                      Rating
                    </Button>
                    <Button 
                      variant={tempFilters.sortBy === 'newest' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSortChange('newest')}
                    >
                      Newest
                    </Button>
                    <Button 
                      variant={tempFilters.sortBy === 'name' ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs"
                      onClick={() => handleSortChange('name')}
                    >
                      Name A-Z
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <SheetFooter className="flex-row justify-between sm:justify-between">
              <Button variant="outline" onClick={handleReset}>
                Reset All
              </Button>
              <SheetClose asChild>
                <Button onClick={handleApply}>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Active Filter Badges */}
        <div className="flex flex-wrap gap-1">
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilters({})}
              className="h-8 px-2 text-xs"
            >
              Clear All
              <X className="ml-1 h-3 w-3" />
            </Button>
          )}
          
          {filters.categories?.map((category) => {
            const categoryObj = TOOL_CATEGORIES.find(c => c.id === category);
            return (
              <Badge 
                key={category} 
                variant="outline" 
                className="group flex items-center gap-1"
              >
                {categoryObj?.label || category}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setFilters({
                    ...filters,
                    categories: filters.categories?.filter(c => c !== category)
                  })}
                />
              </Badge>
            );
          })}
          
          {filters.accessLevels?.map((level) => (
            <Badge 
              key={level} 
              variant="outline" 
              className="group flex items-center gap-1"
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({
                  ...filters,
                  accessLevels: filters.accessLevels?.filter(l => l !== level)
                })}
              />
            </Badge>
          ))}
          
          {filters.hasApi && (
            <Badge 
              variant="outline" 
              className="group flex items-center gap-1"
            >
              API Available
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({
                  ...filters,
                  hasApi: undefined
                })}
              />
            </Badge>
          )}
          
          {filters.sortBy && (
            <Badge 
              variant="outline" 
              className="group flex items-center gap-1"
            >
              Sort: {filters.sortBy.charAt(0).toUpperCase() + filters.sortBy.slice(1)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters({
                  ...filters,
                  sortBy: undefined
                })}
              />
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
