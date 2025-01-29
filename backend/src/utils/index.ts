
import { ILocation, IRangeObj } from '../types/venue';
import { IDopcOut } from '../types';

import { ILocationSchema } from './schemas';
/**
 * Calculates distance (km) between two coordinates using haversine formula.
 * Acceptable cooridates range is lat [-90,90] long [-180,180)
 * Throws zodError for invalid parameters.
 * @param locA Location point 1
 * @param locB Location point 2
 * @returns Distance between points in km.
 */
export const calculateDistance = (locA: ILocation, locB: ILocation): number => {
    ILocationSchema.parse(locA);
    ILocationSchema.parse(locB);
    
    const deg2rad = (deg: number): number => deg * (Math.PI / 180);

    const R = 6371; // Radius of the earth in km
    const dLon = deg2rad(locB.coordinates[0] - locA.coordinates[0]);
    const dLat = deg2rad(locB.coordinates[1] - locA.coordinates[1]);
    
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(locA.coordinates[1])) * Math.cos(deg2rad(locB.coordinates[1])) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

/**
 * Selects the distance range object based on the distance provided.
 * @param distance Distance
 * @param distanceRanges An array of distance range objects of type IRangeObj
 * @returns range object satisfying the distance.
 */
export const selectDistanceRange = (distance: number, distanceRanges: IRangeObj[]): IRangeObj => {

    if (distance < 0) throw new Error('invalid distance');
    if (distanceRanges.length < 2) throw new Error('must have atleast two objects');
    return distanceRanges.reduceRight((accumulator, currentValue) =>
        distance < accumulator.min ? currentValue : accumulator
    );
};

/**
 * 
 * @param cartValue cart amount
 * @param orderMinimumNoSurcharge The minimum cart value to avoid small order surcharge
 * @param basePrice The base price for delivery fee
 * @param constantAmount A constant amount to be added to the delivery fee on top of the base price
 * @param multiplier Multiplier to be used for calculating distance based component of the delivery fee.
 * @param deliveryDistance delivery distance
 * @returns 
 * total_price (integer): The calculated total price.  
 * small_order_surcharge (integer): The calculated small order surcharge  
 * cart_value (integer): The cart value. This is the same as what was got as query parameter.  
 * delivery (object): An object containing:  
 * fee (integer): The calculated delivery fee  
 * distance (integer): The calculated delivery distance in meters
 */
export const calculateDeliveryPrice = (cartValue: number,
    orderMinimumNoSurcharge: number,
    basePrice: number,
    constantAmount: number,
    multiplier: number,
    deliveryDistance: number): IDopcOut => {

    const deliveryFee = basePrice + constantAmount + Math.round(multiplier * deliveryDistance / 10);

    const smallOrderSurcharge = Math.max(0, orderMinimumNoSurcharge - cartValue);

    const totalPrice = cartValue + smallOrderSurcharge + deliveryFee;

    return {
        total_price: totalPrice,
        small_order_surcharge: smallOrderSurcharge,
        cart_value: cartValue,
        delivery: {
            fee: deliveryFee,
            distance: deliveryDistance
        }
    };
};