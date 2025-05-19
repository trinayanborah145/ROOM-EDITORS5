import { useState, useCallback } from 'react';
import { videoApi } from '../services/api';

interface VideoUploadOptions {
  onProgress?: (progress: number) => void;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

const useVideoUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [uploadedVideo, setUploadedVideo] = useState<any>(null);

  const uploadVideo = useCallback(
    async (file: File, metadata: { title: string; description?: string }) => {
      if (!file) {
        setError(new Error('No file provided'));
        return null;
      }

      setIsUploading(true);
      setProgress(0);
      setError(null);

      try {
        // Step 1: Get pre-signed URL for upload
        const { data: uploadData } = await videoApi.getUploadUrl(
          file.name,
          file.type
        );

        // Step 2: Upload file to S3
        await videoApi.uploadToS3(
          uploadData.uploadUrl,
          file,
          (uploadProgress) => {
            setProgress(uploadProgress);
          }
        );

        // Step 3: Create video record in database
        const videoData = {
          title: metadata.title,
          description: metadata.description,
          url: uploadData.url,
          key: uploadData.key,
          duration: 0, // You can extract this using a video processing library
          width: 0, // Extract from video metadata
          height: 0, // Extract from video metadata
          mimeType: file.type,
          size: file.size,
        };

        const { data: createdVideo } = await videoApi.createVideo(videoData);
        setUploadedVideo(createdVideo);
        return createdVideo;
      } catch (err) {
        const error = err as Error;
        setError(error);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUploadedVideo(null);
  }, []);

  return {
    uploadVideo,
    isUploading,
    progress,
    error,
    uploadedVideo,
    reset,
  };
};

export default useVideoUpload;
