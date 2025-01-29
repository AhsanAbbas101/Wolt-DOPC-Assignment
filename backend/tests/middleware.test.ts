import { Request, Response, NextFunction } from 'express';
import * as middleware from '../src/utils/middleware';
import { z, ZodError } from 'zod';



describe('middleware tests', () => {

    describe('IDopcParamsParser validation middleware', () => {
        it('throws error on empty query params', () => {
            const req = { query: {} } as Request;
            const res = { status: jest.fn() } as unknown as Response;
            const next = jest.fn() as NextFunction;

            middleware.IDopcParamsParser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(ZodError));
        });

        it('throws error on invalid query params names', () => {
            const req = {
                query: {
                    userLon:0,
                    userLat:0,
                    cartValue:0,
                    venueSlug:0,
                }
            } as unknown as Request;
            const res = { status: jest.fn() } as unknown as Response;
            const next = jest.fn() as NextFunction;

            middleware.IDopcParamsParser(req, res, next);
            expect(next).toHaveBeenCalledWith(expect.any(ZodError));
        });

        it('calls next on valid query params', () => {
            const req = {
                query: {
                    user_lon:'0',
                    user_lat:'0',
                    cart_value:'0',
                    venue_slug:'url-here',
                }
            } as unknown as Request;
            const res = { status: jest.fn() } as unknown as Response;
            const next = jest.fn() as NextFunction;

            middleware.IDopcParamsParser(req, res, next);
            expect(next).toHaveBeenCalled();
            expect(next).not.toHaveBeenCalledWith(expect.any(ZodError));
        });


    });

    describe('errorMiddleware', () => {
        it('sends error string for zod error', () => {
            const req = {} as Request;
            const res = {
                send: jest.fn(),
            } as unknown as Response;
            const error = z.number().safeParse('error').error as z.ZodError<number>;
            const next = jest.fn();

            middleware.errorMiddleware(error, req, res, next as NextFunction);

            expect(res.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(expect.any(String)); 

        });

        it('sends error message for Error type', () => {
            const req = {} as Request;
            const res = {
                send: jest.fn(),
            } as unknown as Response;
            const error = new Error('error');
            const next = jest.fn();

            middleware.errorMiddleware(error, req, res, next as NextFunction);

            expect(res.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(expect.any(String)); 

        });

        it('sends error message if error not determined.', () => {
            const next = jest.fn();
            const res = {
                send: jest.fn(),
            } as unknown as Response;
            middleware.errorMiddleware('error', {} as Request, res, next as NextFunction);

            expect(res.send).toHaveBeenCalled();
            expect(res.send).toHaveBeenCalledWith(expect.any(String));
        });

    });

    describe('unknownEndpoint', () => {
        it('sends 404 status', () => {
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            } as unknown as Response;
            
            middleware.unknownEndpoint({} as Request, res);

            expect(res.status).toHaveBeenCalledWith(404); 
            expect(res.send).toHaveBeenCalledWith(expect.any(String)); 

        });
    });
});