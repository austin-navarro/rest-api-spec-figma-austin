import React from 'react';
import { cn } from '@/lib/utils';

interface SegmentedPickerProps extends React.SVGAttributes<SVGElement> {
  className?: string;
}

export const SegmentedPicker = React.forwardRef<SVGSVGElement, SegmentedPickerProps>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-6 w-6', className)}
        {...props}
      >
        <path
          d="M3 7h18M3 12h18M3 17h18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
);

SegmentedPicker.displayName = 'SegmentedPicker';
