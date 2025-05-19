import React, { useState, useEffect, useRef } from 'react';

// Simple classNames helper function
const classNames = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface OptimizedVideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'onClick'> {
  src: string;
  placeholderSrc?: string;
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  onVideoClick?: (e: React.MouseEvent<HTMLVideoElement>) => void;
}

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  className = '',
  preload = 'metadata',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  onVideoClick,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();

  const handleCanPlay = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    console.error('Error loading video:', src);
    setIsLoaded(true);
  };

  // Handle click on the video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoClick = (e: MouseEvent) => {
      if (onVideoClick) {
        onVideoClick(e as unknown as React.MouseEvent<HTMLVideoElement>);
      } else if (video.paused) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    };

    video.addEventListener('click', handleVideoClick);
    return () => {
      video.removeEventListener('click', handleVideoClick);
    };
  }, [onVideoClick]);

  // Handle intersection observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
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

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle video loading
  useEffect(() => {
    if (!isInView) return;
    
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoPlay && video) {
        video.play().catch(error => {
          console.error('Error with autoplay:', error);
        });
      }
    };

    const handleError = () => {
      console.error('Error loading video:', src);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Set the source after attaching event listeners
    video.src = src;
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.src = '';
    };
  }, [isInView, src, autoPlay]);

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    e.stopPropagation();
    if (onVideoClick) {
      onVideoClick(e);
      return;
    }
    
    if (videoRef.current && isLoaded) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(console.error);
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
    >
      {isInView ? (
        <>
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className={classNames(
                'w-full h-full object-contain transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                (onVideoClick || !controls) && 'cursor-pointer'
              )}
              preload={preload}
              playsInline
              muted={muted}
              loop={loop}
              controls={controls}
              onCanPlay={handleCanPlay}
              onError={handleError}
              onClick={handleVideoClick}
              {...props}
            />
          </div>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-12 h-12 border-t-2 border-primary border-solid rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        <img
          src={placeholderSrc}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          loading="lazy"
        />
      )}
    </div>
  );
};

export default OptimizedVideo;
