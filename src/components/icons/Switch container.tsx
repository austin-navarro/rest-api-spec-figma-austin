import React from 'react';
import { cn } from '@/lib/utils';

interface SwitchcontainerProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const Switchcontainer = React.forwardRef<SVGSVGElement, SwitchcontainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <use href="/assets/icons/Switch container.svg#icon" />
      </svg>
    );
  }
);

Switchcontainer.displayName = 'Switchcontainer';
