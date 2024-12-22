import React from 'react';
import { cn } from '@/lib/utils';

interface HorizontalcontainerProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Horizontalcontainer = React.forwardRef<SVGSVGElement, HorizontalcontainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <use href="/assets/icons/Horizontal container.svg#icon" />
      </svg>
    );
  }
);

Horizontalcontainer.displayName = 'Horizontalcontainer';
