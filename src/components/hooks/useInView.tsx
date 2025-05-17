import { useRef, useState, useEffect } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export const useInView = <T extends HTMLElement = HTMLElement>(options: UseInViewOptions = {}) => {
  const { 
    threshold = 0.1, 
    rootMargin = '0px', 
    once = true 
  } = options;
  
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once && ref.current) {
            observer.unobserve(ref.current);
          }
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );
    
    const currentRef = ref.current;
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);
  
  return { ref, inView };
};