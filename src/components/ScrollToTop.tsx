import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 md:bottom-8 right-6 z-30 w-11 h-11 rounded-full bg-stone-900/90 hover:bg-stone-900 text-white shadow-xl backdrop-blur-md border border-stone-700 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl cursor-pointer"
      title="Scroll to top"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 text-amber-400" />
    </button>
  );
};
