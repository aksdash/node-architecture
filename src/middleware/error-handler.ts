import type { ErrorRequestHandler } from "express";
import { ILogger } from "../infrastructure/logger/logger.interface";

export class HttpError extends Error{
    constructor(public readonly statusCode:number, message){
        super(message)
        this.name = "HttpError"
    }
}

export function createErrorMiddleware(
    logger: ILogger
):ErrorRequestHandler{
  
        return (err, req, res, _next) => {
    const error = err instanceof Error
        ? err
        : new Error(String(err));

    const statusCode =
        error instanceof HttpError
            ? error.statusCode
            : 500;

    logger.error(
        'http.request.failed',
        error,
        {
            method: req.method,
            path: req.path,
            statusCode,
        }
    )

     res.status(statusCode).json({
            error: {
                message:
                    statusCode >= 500
                        ? "Internal server error"
                        : error.message,
                requestId: res.getHeader("X-Request-ID")
            }
        });
    
    }
}
