import React from 'react';

interface COMPONENT_NAMEProps {
  className?: string;
  children?: React.ReactNode;
}

export const COMPONENT_NAME: React.FC<COMPONENT_NAMEProps> = ({
  className = '',
  children,
}) => {
  return (
    <div className={`COMPONENT_NAME ${className}`}>
      {children}
    </div>
  );
};

export default COMPONENT_NAME;
