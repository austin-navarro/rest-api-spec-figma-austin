import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  fluid?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, fluid = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 md:px-6',
          {
            'max-w-screen-2xl': fluid,
            'max-w-screen-xl': !fluid,
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container'; 