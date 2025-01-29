
import { IDeliverySpecs } from "../types/venue";

import { calculateDeliveryPrice, selectDistanceRange } from "../utils";
import { DOPCError } from "../utils/errors";

export const calculate = (cartValue: number, deliveryDistance: number, deliverySpecs: IDeliverySpecs ) => {
    
    const selectedRange = selectDistanceRange(deliveryDistance, deliverySpecs.delivery_pricing.distance_ranges)
    if (!selectedRange.max)     // delivery not possible due to max distance reached
        throw new DOPCError({ name: 'DISTANCE_ERROR', message: 'Delivery not possible due to max distance.' })

    return  calculateDeliveryPrice(
        cartValue, 
        deliverySpecs.order_minimum_no_surcharge,
        deliverySpecs.delivery_pricing.base_price,
        selectedRange.a,
        selectedRange.b,
        deliveryDistance
    )
     
}