import React from 'react';
import { cn } from '@/lib/utils';

interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, active, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
          {
            'bg-primary-blue text-white': active,
            'text-grey-dark hover:bg-grey-light': !active,
          },
          className
        )}
        {...props}
      >
        {icon && <span className="h-4 w-4">{icon}</span>}
        {children}
      </button>
    );
  }
);

Tab.displayName = 'Tab';

interface TabGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  vertical?: boolean;
}

export const TabGroup = React.forwardRef<HTMLDivElement, TabGroupProps>(
  ({ className, vertical = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex rounded-lg bg-white p-1 shadow-sm',
          {
            'flex-col': vertical,
            'items-center gap-2': !vertical,
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

TabGroup.displayName = 'TabGroup'; 