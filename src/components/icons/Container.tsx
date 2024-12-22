import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Container = React.forwardRef<SVGSVGElement, ContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <use href="/assets/icons/Container.svg#icon" />
      </svg>
    );
  }
);

Container.displayName = 'Container';
