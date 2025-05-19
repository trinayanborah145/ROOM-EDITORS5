import React, { useState, useEffect, useRef, useCallback } from 'react';

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
  priority?: 'high' | 'low'; // Add priority for important videos
}

// Video quality settings
const QUALITY = {
  low: {
    width: 480,
    height: 270,
    bitrate: 800000, // 800kbps
    framerate: 24
  },
  medium: {
    width: 854,
    height: 480,
    bitrate: 1500000, // 1.5Mbps
    framerate: 30
  },
  high: {
    width: 1280,
    height: 720,
    bitrate: 4000000, // 4Mbps
    framerate: 30
  }
};

const OptimizedVideo: React.FC<OptimizedVideoProps> = ({
  src,
  placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
  className = '',
  preload = 'metadata',
  autoPlay = false,
  muted = true,
  loop = false,
  controls = true,
  priority = 'low',
  onVideoClick,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('low');
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>();
  const connectionRef = useRef<{ effectiveType?: string; saveData?: boolean }>({});

  const handleCanPlay = useCallback(() => {
    console.log('Video can play:', src);
    setIsLoaded(true);
  }, [src]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const errorDetails = {
      src: video.src,
      error: video.error ? {
        code: video.error.code,
        message: video.error.message,
        name: video.error.toString()
      } : null,
      networkState: getNetworkStateText(video.networkState),
      readyState: getReadyStateText(video.readyState),
      videoElement: {
        currentSrc: video.currentSrc,
        error: video.error,
        networkState: video.networkState,
        readyState: video.readyState,
        buffered: video.buffered,
        seekable: video.seekable,
        duration: video.duration,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight
      }
    };
    
    console.error('Error loading video:', errorDetails);
    setIsLoaded(true);
  }, []);
  
  const getNetworkStateText = (state: number): string => {
    const states = [
      'NETWORK_EMPTY',     // 0
      'NETWORK_IDLE',      // 1
      'NETWORK_LOADING',   // 2
      'NETWORK_NO_SOURCE'  // 3
    ];
    return states[state] || `UNKNOWN (${state})`;
  };
  
  const getReadyStateText = (state: number): string => {
    const states = [
      'HAVE_NOTHING',      // 0
      'HAVE_METADATA',     // 1
      'HAVE_CURRENT_DATA', // 2
      'HAVE_FUTURE_DATA',  // 3
      'HAVE_ENOUGH_DATA'   // 4
    ];
    return states[state] || `UNKNOWN (${state})`;
  };

  const handleLoadStart = useCallback(() => {
    console.log('Video load started:', src);
  }, [src]);

  const handleLoadedData = useCallback(() => {
    console.log('Video loaded data:', src);
    setIsLoaded(true);
  }, [src]);

  const handleVideoClick = useCallback((e: React.MouseEvent<HTMLVideoElement>) => {
    if (onVideoClick) {
      onVideoClick(e);
    }
  }, [onVideoClick]);

  // Detect device and connection info
  useEffect(() => {
    // Check if mobile
    const checkIfMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    // Save connection info
    const updateConnectionInfo = () => {
      // @ts-ignore - navigator.connection is not in TypeScript's types
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        connectionRef.current = {
          effectiveType: connection.effectiveType,
          saveData: connection.saveData
        };
        
        // Set initial quality based on connection
        if (connection.effectiveType === '4g' && !connection.saveData) {
          setQuality('high');
        } else if (connection.effectiveType === '3g' || connection.saveData) {
          setQuality('medium');
        } else {
          setQuality('low');
        }
      } else {
        // Default to medium quality if connection info is not available
        setQuality('medium');
      }
    };
    
    checkIfMobile();
    updateConnectionInfo();
    
    // Listen for connection changes
    // @ts-ignore - navigator.connection is not in TypeScript's types
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      connection.addEventListener('change', updateConnectionInfo);
      return () => connection.removeEventListener('change', updateConnectionInfo);
    }
  }, []);

  // Handle video source changes with adaptive quality
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    console.log('Video source set to:', src, 'with quality:', quality);
    
    // Reset loaded state when source changes
    setIsLoaded(false);
    
    // Get the base URL and extension
    const baseUrl = src.replace(/\.[^/.]+$/, '');
    const extension = src.split('.').pop();
    
    // Clear existing sources
    while (video.firstChild) {
      video.removeChild(video.firstChild);
    }
    
    // Add sources based on quality
    const addSource = (src: string, type: string) => {
      const source = document.createElement('source');
      source.src = src;
      source.type = type;
      video.appendChild(source);
    };
    
    // Add WebM source (better compression)
    const webmSrc = `${baseUrl}.webm`;
    addSource(webmSrc, 'video/webm');
    
    // Add MP4 source (fallback)
    addSource(src, 'video/mp4');
    
    // Set preload based on priority
    video.preload = priority === 'high' ? 'auto' : 'metadata';
    
    // Set video quality based on device and connection
    const { width, height } = QUALITY[quality];
    video.width = width;
    video.height = height;
    
    // Force reload the video source
    try {
      video.load();
      
      // If this is a high priority video, preload it
      if (priority === 'high') {
        video.preload = 'auto';
        video.load();
      }
    } catch (error) {
      console.error('Error loading video:', error);
    }
    
    // Cleanup
    return () => {
      // Pause and reset the video when unmounting or source changes
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.01
      }
    );

    observer.observe(containerRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Handle video playback when in view
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isInView) return;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Video autoplay failed:', error);
      });
    }

    return () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    };
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      className={classNames(
        'relative w-full h-full overflow-hidden',
        className
      )}
    >
      {isInView ? (
        <>
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              className={classNames(
                'w-full h-full object-cover transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
              preload={preload}
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              controls={controls}
              onCanPlay={handleCanPlay}
              onError={handleError}
              onLoadStart={handleLoadStart}
              onLoadedData={handleLoadedData}
              onClick={handleVideoClick}
              playsInline
              {...props}
            >
              <source src={src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-pulse text-gray-400">Loading video...</div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-gray-400">Scroll to load video</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedVideo, (prevProps, nextProps) => {
  return prevProps.src === nextProps.src &&
         prevProps.className === nextProps.className;
});
