# Video Portfolio Backend

A high-performance backend for handling video uploads, streaming, and management.

## Features

- **Video Uploads**: Direct upload to AWS S3 with pre-signed URLs
- **Video Streaming**: Efficient streaming of video content
- **Authentication**: JWT-based authentication
- **API Documentation**: Detailed API documentation with examples
- **Logging**: Comprehensive request and error logging
- **Rate Limiting**: Protection against abuse
- **Environment Configuration**: Easy configuration via environment variables

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- AWS Account (for S3 storage)
- npm or yarn

## Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Start the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/video-portfolio

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_NAME=your-s3-bucket-name

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000 # 15 minutes
RATE_LIMIT_MAX=100 # 100 requests per window

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Videos

- `GET /api/v1/videos` - Get all public videos
- `GET /api/v1/videos/:id` - Get a single video
- `GET /api/v1/videos/stream/:id` - Stream a video
- `POST /api/v1/videos/upload-url` - Get a pre-signed URL for upload
- `POST /api/v1/videos` - Create a new video
- `PUT /api/v1/videos/:id` - Update a video
- `DELETE /api/v1/videos/:id` - Delete a video

## Development

- Run in development mode: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`
- Format code: `npm run format`

## Production Deployment

1. Build the application
   ```bash
   npm run build
   ```

2. Start the production server
   ```bash
   npm start
   ```

For production, consider using a process manager like PM2:

```bash
npm install -g pm2
pm2 start dist/server.js --name video-portfolio-api
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
