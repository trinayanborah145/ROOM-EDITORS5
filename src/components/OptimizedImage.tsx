import React, { useEffect, useState } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  className = '',
  ...props
}) => {
  // Ensure the image path is absolute by adding a leading slash if it doesn't have one
  const normalizedSrc = src.startsWith('/') ? src : `/${src}`;
  const { imageSrc, isLoading, imgRef } = useLazyImage(normalizedSrc);
  
  // Log image loading state for debugging
  useEffect(() => {
    if (imageSrc) {
      console.log('Image loaded:', imageSrc);
    }
  }, [imageSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={imageSrc || placeholderSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onError={(e) => {
          console.error('Error loading image:', normalizedSrc);
          if (props.onError) props.onError(e as any);
        }}
        loading="lazy"
        {...props}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
      )}
    </div>
  );
};

export default OptimizedImage;
