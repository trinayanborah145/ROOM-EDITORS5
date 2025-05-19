import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Video API
export const videoApi = {
  // Get all videos
  getVideos: () => api.get('/videos'),

  // Get single video
  getVideo: (id: string) => api.get(`/videos/${id}`),

  // Get video stream URL
  getVideoStreamUrl: (id: string) => `${API_URL}/videos/${id}/stream`,

  // Get upload URL
  getUploadUrl: (fileName: string, fileType: string) =>
    api.post('/videos/upload-url', { fileName, fileType }),

  // Upload video to S3
  uploadToS3: async (uploadUrl: string, file: File, onProgress?: (progress: number) => void) => {
    return axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  },

  // Create video record
  createVideo: (videoData: {
    title: string;
    description?: string;
    url: string;
    key: string;
    duration: number;
    width: number;
    height: number;
    mimeType: string;
    size: number;
  }) => api.post('/videos', videoData),

  // Update video
  updateVideo: (
    id: string,
    videoData: {
      title?: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    }
  ) => api.patch(`/videos/${id}`, videoData),

  // Delete video
  deleteVideo: (id: string) => api.delete(`/videos/${id}`),
};

export default api;
