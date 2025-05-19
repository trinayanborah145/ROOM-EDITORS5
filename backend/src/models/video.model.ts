import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number; // in seconds
  size: number; // in bytes
  mimeType: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  isPublic: boolean;
  userId: mongoose.Types.ObjectId;
  tags?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    url: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
    },
    duration: {
      type: Number,
      min: 0,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    mimeType: {
      type: String,
      required: true,
    },
    width: {
      type: Number,
      min: 0,
    },
    height: {
      type: Number,
      min: 0,
    },
    aspectRatio: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add text index for search
VideoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Add compound index for better query performance
VideoSchema.index({ userId: 1, createdAt: -1 });

// Calculate aspect ratio before saving
VideoSchema.pre<IVideo>('save', function (next) {
  if (this.width && this.height) {
    this.aspectRatio = this.width > this.height ? 'landscape' : 'portrait';
  }
  next();
});

export default mongoose.model<IVideo>('Video', VideoSchema);
