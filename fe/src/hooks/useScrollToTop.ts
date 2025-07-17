import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Multiple scroll methods for maximum compatibility
    const scrollToTop = () => {
      // Method 1: Standard window.scrollTo
      try {
        window.scrollTo(0, 0);
      } catch (e) {
        console.warn('window.scrollTo failed:', e);
      }

      // Method 2: Document element scroll
      try {
        if (document.documentElement) {
          document.documentElement.scrollTop = 0;
        }
      } catch (e) {
        console.warn('documentElement.scrollTop failed:', e);
      }

      // Method 3: Body scroll
      try {
        if (document.body) {
          document.body.scrollTop = 0;
        }
      } catch (e) {
        console.warn('body.scrollTop failed:', e);
      }
    };

    // Immediate scroll
    scrollToTop();

    // Delayed scroll for better reliability
    const timer1 = setTimeout(() => {
      scrollToTop();
    }, 50);

    // Final smooth scroll for UX
    const timer2 = setTimeout(() => {
      try {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } catch (e) {
        // Fallback to instant scroll if smooth is not supported
        window.scrollTo(0, 0);
      }
    }, 150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [pathname]);
};

export default useScrollToTop; 