import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface RouteLoaderProps {
  children: React.ReactNode;
  delay?: number;
}

const RouteLoader: React.FC<RouteLoaderProps> = ({ children, delay = 300 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading page..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteLoader;