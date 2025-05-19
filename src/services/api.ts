import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Video API
export const videoApi = {
  // Get all videos
  getVideos: async () => {
    const response = await api.get('/videos');
    return response.data;
  },

  // Get single video
  getVideo: async (id: string) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  // Get video stream URL
  getVideoStreamUrl: (id: string) => {
    return `${API_URL}/videos/stream/${id}`;
  },

  // Get upload URL
  getUploadUrl: async (fileName: string, fileType: string) => {
    const response = await api.post('/videos/upload-url', { fileName, fileType });
    return response.data;
  },

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
  createVideo: async (videoData: {
    title: string;
    description?: string;
    url: string;
    key: string;
    duration: number;
    width: number;
    height: number;
    mimeType: string;
    size: number;
  }) => {
    const response = await api.post('/videos', videoData);
    return response.data;
  },

  // Update video
  updateVideo: async (
    id: string,
    videoData: {
      title?: string;
      description?: string;
      isPublic?: boolean;
      tags?: string[];
    }
  ) => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  },

  // Delete video
  deleteVideo: async (id: string) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  },
};

// Auth API
export const authApi = {
  // Login
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Register
  register: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default api;
