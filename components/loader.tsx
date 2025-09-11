'use client';

import React from 'react';

interface LoaderProps {
  size?: number;       // px
  borderWidth?: number; // px
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({
  size = 48,
  borderWidth = 4,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-t-gold border-b-gold border-l-transparent border-r-transparent"
        style={{
          width: size,
          height: size,
          borderWidth,
        }}
      />
    </div>
  );
};

export default Loader;
