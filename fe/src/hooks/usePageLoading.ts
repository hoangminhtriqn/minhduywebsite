import { useState, useEffect } from 'react';

interface UsePageLoadingOptions {
  minLoadingTime?: number;
  dependencies?: any[];
}

export const usePageLoading = (options: UsePageLoadingOptions = {}) => {
  const { minLoadingTime = 1500, dependencies = [] } = options;
  const [isLoading, setIsLoading] = useState(true);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const checkLoadingTime = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime);
    };

    checkLoadingTime();
  }, [startTime, minLoadingTime, ...dependencies]);

  return { isLoading, setIsLoading };
}; 