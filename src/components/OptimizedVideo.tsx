import React, { useState, useEffect, useRef } from 'react';

interface OptimizedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  placeholderSrc?: string;
  className?: string;
  preload?: 'none' | 'metadata' | 'auto';
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  onVideoClick?: () => void;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleClick = () => {
    if (onVideoClick) {
      onVideoClick();
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {isInView ? (
        <>
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            preload={preload}
            playsInline
            muted={muted}
            loop={loop}
            controls={controls}
            {...props}
          />
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
