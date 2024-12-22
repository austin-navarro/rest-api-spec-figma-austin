import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export interface Category {
  id: string;
  name: string;
  count?: number;
}

interface CategoriesProps extends React.HTMLAttributes<HTMLDivElement> {
  categories: Category[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  showCounts?: boolean;
}

export const Categories = React.forwardRef<HTMLDivElement, CategoriesProps>(
  ({ 
    className,
    categories,
    selectedCategory,
    onCategorySelect,
    showCounts = true,
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-2', className)}
        {...props}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onCategorySelect?.(category.id)}
            className="rounded-full"
          >
            {category.name}
            {showCounts && category.count !== undefined && (
              <span className="ml-2 rounded-full bg-grey-light px-2 py-0.5 text-xs text-grey-dark">
                {category.count}
              </span>
            )}
          </Button>
        ))}
      </div>
    );
  }
);

Categories.displayName = 'Categories'; 