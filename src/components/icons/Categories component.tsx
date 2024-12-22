import React from 'react';
import { cn } from '@/lib/utils';

interface CategoriescomponentProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Categoriescomponent = React.forwardRef<SVGSVGElement, CategoriescomponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <use href="/assets/icons/Categories component.svg#icon" />
      </svg>
    );
  }
);

Categoriescomponent.displayName = 'Categoriescomponent';
