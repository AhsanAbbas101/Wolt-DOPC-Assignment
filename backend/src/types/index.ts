import { z } from 'zod';
import { IDopcParamsSchema } from '../utils/schemas';


export type IDOPCParams = z.infer<typeof IDopcParamsSchema>;

export interface IDopcOut {
    total_price: number,
    small_order_surcharge: number,
    cart_value: number,
    delivery: {
        fee: number,
        distance: number
    }
}
