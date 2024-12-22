import React from 'react';
import { cn } from '@/lib/utils';

interface GroupProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Group = React.forwardRef<SVGSVGElement, GroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <use href="/assets/icons/Group.svg#icon" />
      </svg>
    );
  }
);

Group.displayName = 'Group';
