import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import Video, { IVideo } from '../models/video.model';
import { logger } from '../utils/logger';
import { s3, getSignedUrl, deleteFile } from '../config/s3';

const unlinkAsync = promisify(fs.unlink);

// @desc    Get all videos
// @route   GET /api/v1/videos
// @access  Public
export const getVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const videos = await Video.find({ isPublic: true })
      .sort('-createdAt')
      .select('-__v');

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video
// @route   GET /api/v1/videos/:id
// @access  Public
export const getVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get video stream
// @route   GET /api/v1/videos/stream/:id
// @access  Public
export const streamVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // For now, we'll just redirect to the video URL
    // In a production environment, you would want to implement proper streaming
    // with support for range requests, adaptive bitrate, etc.
    res.redirect(video.url);
  } catch (error) {
    next(error);
  }
};

// @desc    Get upload URL for direct S3 upload
// @route   POST /api/v1/videos/upload-url
// @access  Private
export const getUploadUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide file name and type',
      });
    }

    const fileExt = path.extname(fileName).toLowerCase();
    const key = `videos/${uuidv4()}${fileExt}`;

    const uploadUrl = await getSignedUrl(key, fileType);

    res.status(200).json({
      success: true,
      data: {
        uploadUrl,
        key,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create video metadata after upload
// @route   POST /api/v1/videos
// @access  Private
export const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { title, description, url, key, duration, width, height, mimeType, size } = req.body;

    // In a real app, you would get the user ID from the auth token
    const userId = req.user?.id || new mongoose.Types.ObjectId();

    const video = await Video.create({
      title,
      description,
      url,
      key,
      duration,
      width,
      height,
      mimeType,
      size,
      userId,
    });

    res.status(201).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update video
// @route   PUT /api/v1/videos/:id
// @access  Private
export const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, isPublic, tags } = req.body;

    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Check if user owns the video
    // In a real app, you would check against the authenticated user
    // if (video.userId.toString() !== req.user.id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Not authorized to update this video',
    //   });
    // }


    // Update fields
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (isPublic !== undefined) video.isPublic = isPublic;
    if (tags) video.tags = tags;

    await video.save();

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/v1/videos/:id
// @access  Private
export const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found',
      });
    }

    // Check if user owns the video
    // In a real app, you would check against the authenticated user
    // if (video.userId.toString() !== req.user.id) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Not authorized to delete this video',
    //   });
    // }


    // Delete from S3
    if (video.key) {
      await deleteFile(video.key);
    }

    // Delete from database
    await video.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
