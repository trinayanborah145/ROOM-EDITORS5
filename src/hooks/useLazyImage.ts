import { useEffect, useState, useRef, useCallback } from 'react';

export const useLazyImage = (src: string) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const observerRef = useRef<IntersectionObserver>();
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState<boolean>(false);

  const loadImage = useCallback(() => {
    if (!src) return;
    
    setIsLoading(true);
    setError(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      setIsLoading(false);
      setError(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  useEffect(() => {
    if (!src) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage();
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

    const currentImgRef = imgRef.current;
    if (currentImgRef) {
      observerRef.current.observe(currentImgRef);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, loadImage]);

  return { 
    imageSrc, 
    isLoading, 
    error,
    imgRef,
    retry: loadImage
  };
};
