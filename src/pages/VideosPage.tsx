import React, { useState } from 'react';
import { PlusIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import VideoList from '../components/VideoList';
import VideoUploader from '../components/VideoUploader';

const VideosPage: React.FC = () => {
  const [showUploader, setShowUploader] = useState(false);

  const handleUploadSuccess = () => {
    setShowUploader(false);
    // Refresh the video list
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse and manage your video collection
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploader(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Upload Video
        </button>
      </div>

      {showUploader && (
        <div className="mb-8">
          <VideoUploader
            onUploadSuccess={handleUploadSuccess}
            onUploadError={(error) => console.error('Upload error:', error)}
            className="mb-8"
          />
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center">
          <VideoCameraIcon className="h-6 w-6 text-gray-500 mr-2" />
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            All Videos
          </h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <VideoList className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </div>

      {/* Upload modal */}
      {showUploader && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Upload New Video
                  </h3>
                  <div className="mt-4">
                    <VideoUploader
                      onUploadSuccess={handleUploadSuccess}
                      onUploadError={(error) => console.error('Upload error:', error)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  onClick={() => setShowUploader(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideosPage;
