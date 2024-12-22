import React from 'react';
import { cn } from '@/lib/utils';

interface Frame7207Props extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Frame7207 = React.forwardRef<SVGSVGElement, Frame7207Props>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <use href="/assets/icons/Frame 7207.svg#icon" />
      </svg>
    );
  }
);

Frame7207.displayName = 'Frame7207';
