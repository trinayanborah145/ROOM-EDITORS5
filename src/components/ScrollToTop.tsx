import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);
  
  return (
    <button
      className={`fixed bottom-6 right-6 bg-accent hover:bg-accent/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
      }`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
};