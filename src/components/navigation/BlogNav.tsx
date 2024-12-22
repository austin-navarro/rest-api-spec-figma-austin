import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { TempLogoIcon } from '../ui/TempLogoIcon';

interface BlogNavProps extends React.HTMLAttributes<HTMLElement> {
  onHomeClick?: () => void;
  onBlogClick?: () => void;
}

export const BlogNav = React.forwardRef<HTMLElement, BlogNavProps>(
  ({ className, onHomeClick, onBlogClick, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'flex items-center justify-between bg-white px-4 py-3 shadow-sm',
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onHomeClick}
            className="gap-2"
          >
            <TempLogoIcon size="sm" />
            <span>To Moso.xyz</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onBlogClick}
            className="gap-2"
          >
            <span>To Blog Home</span>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm">
            Subscribe
          </Button>
        </div>
      </nav>
    );
  }
);

BlogNav.displayName = 'BlogNav'; 