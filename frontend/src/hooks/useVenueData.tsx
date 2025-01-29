import { useState, useEffect } from 'react';
import venueService from '../services/venueService'; // assuming venueService is imported correctly
import { IDeliverySpecs, ILocation } from '../types/venue';
import { DOPCError, ValueErrorHandler } from '../utils/errors';

const useVenueData = (venueSlug: string | null) => {
    const [venueLocation, setVenueLocation] = useState<ILocation | null>(null);
    const [deliverySpecs, setDeliverySpecs] = useState<IDeliverySpecs | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<DOPCError | null>(null);

    useEffect(() => {
        const calculate = async (venue: string) => {
            setLoading(true);
            setError(null);
            try {
                const location = await venueService.getVenueLocation(venue);
                const specs = await venueService.getDeliverySpecs(venue);

                setVenueLocation(location);
                setDeliverySpecs(specs);
            } catch (err: unknown) {
                setError(ValueErrorHandler(err));
                setVenueLocation(null); setDeliverySpecs(null);
            } finally {
                setLoading(false);
            }
        };

        if (venueSlug) {
            void calculate(venueSlug);
        }
    }, [venueSlug]);

    return { venueLocation, deliverySpecs, loading, error };
};

export default useVenueData;