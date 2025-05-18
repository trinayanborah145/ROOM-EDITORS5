import React, { useRef } from 'react';
import useIntersectionObserver from '../hooks/useIntersectionObserver';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMzAwIDIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgc3R5bGU9ImZpbGw6I2YyZjJmMiIvPjwvc3ZnPg==',
  ...props
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const isVisible = useIntersectionObserver(imgRef, {
    rootMargin: '200px',
  });

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : placeholderSrc}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};

export default LazyImage;
