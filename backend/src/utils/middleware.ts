import { NextFunction, Request, Response } from 'express';
import { IDopcParamsSchema } from './schemas';

import morgan from 'morgan';

/**
 * Middleware to validate query parameters for delivery order price calculation.
 * 
 * @throws {ZodError} If the query parameters fail validation, the error is passed to the next middleware.
 * 
 */
export const IDopcParamsParser = (req: Request, res: Response, next: NextFunction) => {
 
    const result = IDopcParamsSchema.safeParse(req.query);
    if (result.success)
        next();
    else {
        res.status(400);
        next(result.error);
    }
    
        
};

import { z } from 'zod';
import { fromError } from 'zod-validation-error';

/**
 * Middleware to handle errors and send error response.
 */
export const errorMiddleware = (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    let message = 'Internal Server Error';

    if (error instanceof z.ZodError) {
        message = fromError(error).toString();
    }
    else if (error instanceof Error)
        message = error.message;
    
    res.send( message );
};

/**
 * Middleware to handle unknown endpoint. Sends status 404
 * with text 'unknown endpoint'
 */
export const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(404).send('unknown endpoint');
};



/**
 * Custom morgan token to log request body.
 */
morgan.token('req-data', (req:Request) => {
    return JSON.stringify(req.body);
});


export const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :req-data');