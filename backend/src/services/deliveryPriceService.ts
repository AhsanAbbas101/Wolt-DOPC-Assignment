import { IDopcOut, IDOPCParams } from "../types";
import { ILocation } from "../types/venue";
import { calculateDeliveryPrice, calculateDistance, selectDistanceRange } from "../utils";

import venueService from './venueService';

/**
 * Helper function to create ILocation object.
 * @param long Longitude
 * @param lat Latitude
 * @returns ILocation obj
 */
const createILocation = (long: number, lat: number): ILocation => ({
    coordinates: [long, lat]
});

/**
 * Calculates the delivery price based on the given parameters.
 * @param params The parameters for the delivery calculation, including `venue_slug`, `cart_value`, `user_lat`, and `user_lon`.
 * @returns A promise that resolves to the calculated delivery price details as an `IDopcOut` object.
 *
 * @throws {Error} If the delivery distance exceeds or if venue service fails.
 */
export const calculate = async (params: IDOPCParams): Promise<IDopcOut> => {
    const venueLocation = await venueService.getVenueLocation(params.venue_slug);
    const deliverySpecs = await venueService.getDeliverySpecs(params.venue_slug);

    const deliveryDistance = Math.round(calculateDistance(venueLocation, createILocation(params.user_lon, params.user_lat)) * 1000);
    const selectedRange = selectDistanceRange(deliveryDistance, deliverySpecs.delivery_pricing.distance_ranges);
    if (!selectedRange.max)     // delivery not possible due to max distance reached
        throw new Error('Delivery not possible due to max distance.');

    return calculateDeliveryPrice(
        params.cart_value,
        deliverySpecs.order_minimum_no_surcharge,
        deliverySpecs.delivery_pricing.base_price,
        selectedRange.a,
        selectedRange.b,
        deliveryDistance
    );
};