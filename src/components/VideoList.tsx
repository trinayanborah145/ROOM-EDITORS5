import React, { useState, useEffect } from 'react';
import { Video as VideoIcon, Clock, Eye, Download } from 'react-feather';
import { videoApi } from '../services/api';
import VideoPlayer from './VideoPlayer';

interface Video {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

interface VideoListProps {
  onVideoSelect?: (video: Video) => void;
  className?: string;
}

const VideoList: React.FC<VideoListProps> = ({ onVideoSelect, className = '' }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await videoApi.getVideos();
        setVideos(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
      .filter(Boolean)
      .join(':');
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    onVideoSelect?.(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-400 p-4 ${className}`}>
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <VideoIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No videos</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading a new video.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video._id}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
            onClick={() => handleVideoClick(video)}
          >
            <div className="relative w-full bg-gray-100 overflow-hidden">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-contain bg-black"
                    style={{ aspectRatio: 'auto' }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <VideoIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {video.description}
                </p>
              )}
              <div className="mt-3 flex items-center text-xs text-gray-500 mt-auto">
                <div className="flex items-center">
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  <span>{video.views} views</span>
                </div>
                <span className="mx-2">•</span>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(video.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={handleCloseModal}
              aria-hidden="true"
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                        {selectedVideo.title}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={handleCloseModal}
                      >
                        <span className="sr-only">Close</span>
                        <svg 
                          className="h-6 w-6" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M6 18L18 6M6 6l12 12" 
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4">
                      <div className="w-full" style={{ paddingBottom: '56.25%', position: 'relative' }}>
                        <VideoPlayer
                          videoId={selectedVideo._id}
                          autoPlay
                          controls
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                      {selectedVideo.description && (
                        <p className="mt-4 text-sm text-gray-500">
                          {selectedVideo.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <div className="flex items-center mr-4">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{selectedVideo.views} views</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Uploaded on {formatDate(selectedVideo.createdAt)}</span>
                        </div>
                        <a
                          href={selectedVideo.url}
                          download
                          className="ml-auto inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList;
