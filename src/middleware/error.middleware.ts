import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

/**
 * Error Handling Middleware
 * @param err 
 * @param req 
 * @param res 
 * @param _next 
 * @returns 
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    if (err instanceof AppError) {
        logger.error(`AppError: ${err.message}`, {
            statusCode: err.statusCode,
            path: req.path,
            method: req.method,
            errors: err.errors
        });

        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors || [],
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }

    logger.error(`Unexpected Error: ${err.message}`, {
        path: req.path,
        method: req.method,
        stack: err.stack
    });

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && {
            error: err.message,
            stack: err.stack
        })
    });
};

/**
 * Not Found Handler Middleware
 * @param req 
 * @param res 
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
};