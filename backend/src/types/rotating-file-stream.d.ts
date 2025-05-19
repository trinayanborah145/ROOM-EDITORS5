declare module 'rotating-file-stream' {
  import { WriteStream } from 'fs';

  interface RotatingFileStreamOptions {
    path?: string;
    size?: string;
    interval?: string;
    maxFiles?: number;
    maxSize?: string;
    mode?: number;
    compress?: boolean | string;
    immutable?: boolean;
    initialRotation?: boolean;
    pathFormat?: string;
    rotationTimeFormat?: string;
    rotationTimeZone?: string | number;
    rotationDatePattern?: string;
    rotationFilename?: (time: Date, index: number | string) => string;
    filename_format?: string | { (time: Date, index: number | string): string };
  }

  function rfs(
    filename: string | ((time: Date, index: number | string) => string),
    options?: RotatingFileStreamOptions
  ): WriteStream;

  export = rfs;
}
