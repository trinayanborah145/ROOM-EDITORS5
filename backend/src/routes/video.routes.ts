import { Router } from 'express';
import { body } from 'express-validator';
import {
  getVideos,
  getVideo,
  streamVideo,
  getUploadUrl,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/video.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getVideos);
router.get('/:id', getVideo);
router.get('/stream/:id', streamVideo);

// Protected routes (require authentication)
router.use(protect);

// Video upload flow:
// 1. Frontend requests a pre-signed URL for direct S3 upload
// 2. Frontend uploads the file directly to S3 using the pre-signed URL
// 3. After successful upload, frontend sends video metadata to create a video record
router.post(
  '/upload-url',
  [
    body('fileName', 'File name is required').notEmpty(),
    body('fileType', 'File type is required').notEmpty(),
  ],
  getUploadUrl
);

router.post(
  '/',
  [
    body('title', 'Title is required').notEmpty(),
    body('url', 'Video URL is required').notEmpty(),
    body('key', 'S3 key is required').notEmpty(),
    body('mimeType', 'MIME type is required').notEmpty(),
    body('size', 'File size is required').isNumeric(),
  ],
  createVideo
);

router.put(
  '/:id',
  [
    body('title', 'Title cannot be empty').optional().notEmpty(),
    body('description').optional(),
    body('isPublic').optional().isBoolean(),
    body('tags').optional().isArray(),
  ],
  updateVideo
);

router.delete('/:id', deleteVideo);

export default router;
