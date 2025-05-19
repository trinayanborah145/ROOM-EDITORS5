# Video Portfolio Application

A full-stack application for uploading, managing, and displaying video content with user authentication and AWS S3 integration.

## Features

- User authentication (login/register)
- Video upload with progress tracking
- Video playback with a custom player
- Responsive design for all devices
- Secure file storage with AWS S3
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- AWS account (for S3 storage)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env` in both the root and backend directories
   - Update the environment variables with your configuration

4. **Start the development servers**
   ```bash
   # Start the frontend
   npm start

   # In a new terminal, start the backend
   cd backend
   npm run dev
   ```

5. **Open the application**
   The application will be available at `http://localhost:3000`

## Available Scripts

In the project directory, you can run:

- `npm start` - Start the development server
- `npm run build` - Build the app for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Backend API

The backend provides a RESTful API with the following endpoints:

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/videos` - Get all videos
- `GET /api/v1/videos/:id` - Get a single video
- `POST /api/v1/videos` - Create a new video
- `PUT /api/v1/videos/:id` - Update a video
- `DELETE /api/v1/videos/:id` - Delete a video
- `GET /api/v1/videos/stream/:id` - Stream a video
- `POST /api/v1/videos/upload-url` - Get a pre-signed URL for upload

## Environment Variables

### Frontend (`.env`)

```
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_AWS_REGION=your-aws-region
REACT_APP_AWS_BUCKET_NAME=your-s3-bucket-name
REACT_APP_AWS_ACCESS_KEY_ID=your-access-key-id
REACT_APP_AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

### Backend (`.env`)

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
AWS_BUCKET_NAME=your-s3-bucket-name
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
FRONTEND_URL=http://localhost:3000
```

## Deployment

### Frontend

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` directory to your hosting provider (e.g., Vercel, Netlify, or AWS S3).

### Backend

1. Build the application:
   ```bash
   cd backend
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

   Or use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start dist/server.js --name video-portfolio-api
   ```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Router
- React Dropzone
- React Hot Toast
- Headless UI
- Heroicons

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- AWS SDK for S3
- JWT for authentication
- Winston for logging
- TypeScript

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
