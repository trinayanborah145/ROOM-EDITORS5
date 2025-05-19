import React, { useState, useCallback, useRef, ChangeEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiCheck } from 'react-icons/fi';
import useVideoUpload from '../hooks/useVideoUpload';

interface VideoUploaderProps {
  onUploadSuccess?: (video: any) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  accept?: string[];
  maxSize?: number; // in bytes
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  className = '',
  accept = ['video/mp4', 'video/webm', 'video/quicktime'],
  maxSize = 500 * 1024 * 1024, // 500MB
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadVideo, isUploading, progress, error, reset } = useVideoUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.size > maxSize) {
        onUploadError?.(new Error(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`));
        return;
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension
    }
  }, [maxSize, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {} as { [key: string]: string[] }),
    multiple: false,
  });

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > maxSize) {
        onUploadError?.(new Error(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`));
        return;
      }
      setFile(selectedFile);
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')); // Remove file extension
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      onUploadError?.(new Error('Please provide a title and select a file'));
      return;
    }

    try {
      const video = await uploadVideo(file, { title, description });
      onUploadSuccess?.(video);
    } catch (err) {
      const error = err as Error;
      onUploadError?.(error);
    }
  };

  if (isUploading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-700 mb-2">
            Uploading {file?.name}... {Math.round(progress)}%
          </p>
          <p className="text-sm text-gray-500">
            Please wait while we upload your video. Do not close this page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiX className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Upload failed: {error.message}
            </h3>
            <div className="mt-2">
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (file) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <FiCheck className="h-5 w-5 text-green-500" aria-hidden="true" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {file.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter video title"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter video description (optional)"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Upload Video
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} ${className}`}
    >
      <input
        {...getInputProps()}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept.join(',')}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-3">
        <FiUpload className="h-12 w-12 text-gray-400" aria-hidden="true" />
        <div className="text-sm text-gray-600">
          <p className="font-medium text-blue-600 hover:text-blue-500">
            Drag and drop your video here
          </p>
          <p className="text-xs text-gray-500 mt-1">
            or click to browse files (MP4, WebM, or QuickTime, max {maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
