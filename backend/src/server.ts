import http from 'http';
import mongoose from 'mongoose';
import app from './app';
import { logger } from './utils/logger';
import { initS3 } from './config/s3';

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Initialize S3
initS3();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/video-portfolio');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    }
    process.exit(1);
  }
};

// Start server
const startServer = () => {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
};

// Normalize a port into a number, string, or false.
function normalizePort(val: string) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val; // named pipe
  if (port >= 0) return port; // port number
  return false;
}

// Event listener for HTTP server "error" event.
function onError(error: NodeJS.ErrnoException) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  logger.info(`Server is running on ${bind}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

// Connect to database then start the server
connectDB().then(startServer);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
  });
});

export default server;
