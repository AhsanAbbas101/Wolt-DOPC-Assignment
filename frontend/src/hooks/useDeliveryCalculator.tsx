import { useState, useEffect, useMemo } from 'react';
import useVenueData from './useVenueData'
import { IDopcFields, IDopcOut } from '../types';
import { calculateDistance } from '../utils';
import { ILocation } from '../types/venue';
import { DOPCError, ValueErrorHandler } from '../utils/errors';
import { calculate } from '../services/deliveryService';


const createILocation = (long: number, lat: number): ILocation => ({
    coordinates: [long, lat]
})

interface IStateDistance {
    value: number | null;
    error: DOPCError | null;
}
interface IStatePrice {
    value: IDopcOut | null;
    error: DOPCError | null;
}

export const useDeliveryCalculator = (fields: IDopcFields | null) => {

    // Extracting fields
    const {
        venueSlug = null,
        userLongitude = null,
        userLatitude = null,
        cartValue = null,
    } = fields ?? {};


    const venueData = useVenueData(venueSlug);
    const [distance, setDistance] = useState<IStateDistance>({ value: null, error: null });
    const [deliveryPrice, setDeliveryPrice] = useState<IStatePrice>({ value: null, error: null });

    const error = useMemo(() => venueData.error ?? distance.error ?? deliveryPrice.error,
        [venueData.error, distance.error, deliveryPrice.error]);

    // Calculate distance
    useEffect(() => {

        let value = null; let error = null;
        if (!venueData.venueLocation || userLongitude === null || userLatitude === null) {
            setDistance({ value, error });
            return;
        }

        try {
            const userLocation = createILocation(userLongitude, userLatitude);
            const distanceKM = calculateDistance(venueData.venueLocation, userLocation);
            value = Math.round(distanceKM * 1000)   // convert to m
        }
        catch (err: unknown) { error = ValueErrorHandler(err); }
        finally { setDistance({ value, error }); }

    }, [userLongitude, userLatitude, venueData.venueLocation]);

    // Calculate delivery price
    useEffect(() => {

        let value = null; let error = null;
        if (!venueData.deliverySpecs || distance.value === null || cartValue === null) {
            setDeliveryPrice({ value, error });
            return;
        }

        try {
            value = calculate(cartValue, distance.value, venueData.deliverySpecs);
        }
        catch (err: unknown) { error = ValueErrorHandler(err); }
        finally { setDeliveryPrice({ value, error }); }


    }, [cartValue, venueData.deliverySpecs, distance.value]);



    return useMemo(
        () => ({
            deliveryPrice: deliveryPrice.value,
            error,
        }),
        [deliveryPrice.value, error]
    );
};
