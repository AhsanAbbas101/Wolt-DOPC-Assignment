import { z } from 'zod';

/**
 * ZodSchema for DOPC Query parameters  
 *  
 * @property {string} venue_slug - venue url slug  
 * @property {number} cart_value - cart amount - non negative integer due to lowest denomination of currency.  
 * @property {number} user_lat - user latitude location in range [-90,90]  
 * @property {number} user_long - user longitude location in range [-180,180) 
 */
export const IDopcParamsSchema = z.object({
    venue_slug: z.string()
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'invalid venue url slug'),
    cart_value: z.coerce.number()
        .int('cart value must be an integer')
        .min(0, 'invalid cart amount'),
    user_lat: z.coerce.number()
        .min(-90, 'invalid latitude value')
        .max(90, 'invalid latitude value'),
    user_lon: z.coerce.number()
        .min(-180, 'invalid longitude value')
        .lt(180, 'invalid longitude value')
});


/**
 * ZodSchema for Location coordinates.  
 *  
 * @property {[number, number]} coordinates - An array representing the location coordinates.
 * @property {number} coordinates[0] - The longitude of the location.
 * @property {number} coordinates[1] - The latitude of the location.
 */
export const ILocationSchema = z.object({
    coordinates: z.tuple([
        z.number()  // long
            .min(-180)
            .lt(180),
        z.number()  // lat
            .min(-90)
            .max(90)
    ])
});


/**
 * ZodSchema for Delivery Specifications.
 *
 * @typedef {Object} IDeliverySpecs
 * @property {number} order_minimum_no_surcharge - The minimum cart value required to avoid a surcharge. Must be a non-negative integer.
 * @property {IDeliveryPricing} delivery_pricing - Pricing details for deliveries.
 * @property {number} delivery_pricing.base_price - The base price for deliveries. Must be a non-negative integer.
 * @property {IRangeObj[]} delivery_pricing.distance_ranges - An array of distance range objects.
 *
 * @typedef {Object} IRangeObj
 * @property {number} min - The minimum distance for this range.
 * @property {number} max - The maximum distance for this range.
 * @property {number} a - A non-negative integer representing the 'a' (constant amount) coefficient for price calculation.
 * @property {number} b - A coefficient representing the 'b' (multiplier) factor for price calculation.
 * @property {boolean | null} flag - A flag that can be either a boolean or null.
 */
export const IDeliverySpecsSchema = z.object({
    order_minimum_no_surcharge: z.number().int().nonnegative(),
    delivery_pricing: z.object({
        base_price: z.number().int().nonnegative(),
        distance_ranges: z.array(z.object({
            min: z.number(),
            max: z.number(),
            a: z.number().int().nonnegative(),
            b: z.number(),
            flag: z.boolean().or(z.null())
        }))
    })
});
