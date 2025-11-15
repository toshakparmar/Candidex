import dotenv from 'dotenv';
import app from './app';
import logger from './utils/logger';

/**
 * Server Setup
 */
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
    logger.info(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
    logger.info(`Health check available at http://localhost:${PORT}/health`);
});

/**
 * Graceful shutdown
 * Handles termination signals to close the server gracefully.
 */
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
    });
});

/**
 * Handle unhandled promise rejections
 * Logs the error and shuts down the server.
 */
process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled Rejection:', reason);
    server.close(() => {
        process.exit(1);
    });
});

/**
 * Handle uncaught exceptions
 * Logs the error and shuts down the server.
 */
process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    server.close(() => {
        process.exit(1);
    });
});

export default server;