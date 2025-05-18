import { useEffect, useState, useRef } from 'react';

export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const observerRef = useRef<IntersectionObserver>();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            setIsLoading(false);
          };
          if (observerRef.current) {
            observerRef.current.disconnect();
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
      threshold: 0.01
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src]);

  return { imageSrc, isLoading, imgRef };
};
