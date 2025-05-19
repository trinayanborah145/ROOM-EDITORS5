import React, { useRef, useState, useEffect } from 'react';
import { videoApi } from '../services/api';

interface VideoPlayerProps {
  videoId: string;
  autoPlay?: boolean;
  controls?: boolean;
  loop?: boolean;
  muted?: boolean;
  className?: string;
  poster?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  autoPlay = false,
  controls = true,
  loop = false,
  muted = true,
  className = '',
  poster,
  onPlay,
  onPause,
  onEnded,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true);
        const url = videoApi.getVideoStreamUrl(videoId);
        setVideoUrl(url);
        setError(null);
      } catch (err) {
        const error = err as Error;
        setError(error);
        onError?.(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      loadVideo();
    }

    return () => {
      // Clean up any resources if needed
    };
  }, [videoId, onError]);

  const handlePlay = () => {
    onPlay?.();
  };

  const handlePause = () => {
    onPause?.();
  };

  const handleEnded = () => {
    onEnded?.();
  };

  const handleError = () => {
    const error = new Error('Failed to load video');
    setError(error);
    onError?.(error);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <p className="text-red-500">Error loading video: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={videoUrl}
          autoPlay={autoPlay}
          controls={controls}
          loop={loop}
          muted={muted}
          className="w-full max-h-[80vh] object-contain"
          poster={poster}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onError={handleError}
          onLoadedData={handleLoadedData}
          style={{ aspectRatio: 'auto' }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
