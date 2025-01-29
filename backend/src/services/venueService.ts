import config from '../utils/config';
const BASE_URL = config.VENUE_SERVICE_URL;

import axios from 'axios';
import { IDynamicVenue, IStaticVenue, ILocation, IDeliverySpecs } from '../types/venue';


import {IDeliverySpecsSchema, ILocationSchema} from '../utils/schemas';


/**
 * Fetches static information about a venue.
 * @param venueSlug -  url slug for venue.
 * @returns A promise that resolves to the static venue data (IStaticVenue).
 * 
 * @throws {Error|AxiosError} thrown if request fails.
 */
const get_venue_static = async (venueSlug: string): Promise<IStaticVenue> => {
    return (await axios.get<IStaticVenue>(`${BASE_URL}/${venueSlug}/static`)).data;
};

/**
 * Fetches dynamic information about a venue.
 * @param venueSlug -  url slug for venue.
 * @returns A promise that resolves to the static venue data (IDynamicVenue).
 * 
 * @throws {Error|AxiosError} thrown if request fails.
 */
const get_venue_dynamic = async (venueSlug: string): Promise<IDynamicVenue> => {
    return (await axios.get<IDynamicVenue>(`${BASE_URL}/${venueSlug}/dynamic`)).data;
};

/**
 * Retrieves the location of a venue from static venue data.
 * @param venueSlug - url slug for venue.
 * @returns A promise that resolves to the venue's location as an `ILocation` object.
 * 
 * @throws {Error|AxiosError|ZodError} thrown AxiosError if request fails or ZodError if validation fails.
 * 
 */
const getVenueLocation = (venueSlug: string): Promise<ILocation> => {
    return get_venue_static(venueSlug)
         // assuming that all the fields mentioned are always present in the response payload
        .then((data: IStaticVenue): ILocation => data.venue_raw.location)
        .then((location: ILocation): ILocation => ILocationSchema.parse(location));
};

/**
 * Retrieves the delivery specifications for a venue from dynamic venue data.
 * @param venueSlug - url slug for venue.
 * @returns A promise that resolves to the venue's delivery specifications as an `IDeliverySpecs` object.
 * 
 * @throws {Error|AxiosError|ZodError} thrown AxiosError if request fails or ZodError if validation fails.
 */
const getDeliverySpecs = (venueSlug: string): Promise<IDeliverySpecs> => {
    return get_venue_dynamic(venueSlug)
        // assuming that all the fields mentioned are always present in the response payload
        .then((data: IDynamicVenue): IDeliverySpecs => data.venue_raw.delivery_specs)
        .then((specs: IDeliverySpecs): IDeliverySpecs => IDeliverySpecsSchema.parse(specs));
};


export default {
    get_venue_static,
    get_venue_dynamic,
    getVenueLocation,
    getDeliverySpecs
};