import { IDopcOut, IDOPCParams } from '../types';

import express, { NextFunction, Request, Response } from 'express';

import { IDopcParamsParser } from '../utils/middleware';
import { IDopcParamsSchema } from '../utils/schemas';

import { calculate } from '../services/deliveryPriceService';

const router = express.Router();

/**
 * Route handler to calculate and return the delivery price based on query parameters.  
 * Uses IDopcParamsParser before to validate the query parameters.
 * Invokes deliveryPriceService to calucate the price. 
 * 
 * Sends calculated object IDopcOut as json.
 * Propogates the error with status code 500 if any.
 */
router.get('/', IDopcParamsParser, (req: Request, res: Response<IDopcOut>, next: NextFunction) => {
    
    const params: IDOPCParams = IDopcParamsSchema.parse(req.query); //just to convert query params to type IDOPCParams
    
    calculate(params)
        .then((result:IDopcOut) => res.json(result))
        .catch((error: unknown) => {
            res.status(500);
            next(error);
        });
    
});


export default router;