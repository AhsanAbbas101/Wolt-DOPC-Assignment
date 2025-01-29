
const BASE_URL = 'https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues'

import axios from 'axios'
import { IDynamicVenue, IStaticVenue, ILocation, IDeliverySpecs } from '../types/venue'
import { ServiceErrorHandler } from '../utils/errors'

import schemas from '../utils/schemas'

/**
 * Fetches static information about a venue.
 * @param venueSlug -  url slug for venue.
 * @returns A promise that resolves to the static venue data (IStaticVenue).
 * 
 * @throws {Error|AxiosError} thrown if request fails.
 */
const get_venue_static = async (venueSlug: string): Promise<IStaticVenue> => {
    const response = await axios.get<IStaticVenue>(`${BASE_URL}/${venueSlug}/static`)
    return response.data
}

/**
 * Fetches dynamic information about a venue.
 * @param venueSlug -  url slug for venue.
 * @returns A promise that resolves to the static venue data (IDynamicVenue).
 * 
 * @throws {Error|AxiosError} thrown if request fails.
 */
const get_venue_dynamic = async (venueSlug: string): Promise<IDynamicVenue> => {
    const response = await axios.get<IDynamicVenue>(`${BASE_URL}/${venueSlug}/dynamic`)
    return response.data
}

/**
 * Retrieves the location of a venue from static venue data.
 * @param venueSlug - url slug for venue.
 * @returns A promise that resolves to the venue's location as an `ILocation` object.
 * 
 * @throws {DOPCError} thrown DOPCError if request or validation fails.
 * 
 */
const getVenueLocation = (venueSlug: string): Promise<ILocation> => {
    return get_venue_static(venueSlug)
        // assuming that all the fields mentioned are always present in the response payload
        .then((data: IStaticVenue): ILocation => data.venue_raw.location)
        .then((location: ILocation): ILocation => schemas.ILocationSchema.parse(location))
        .catch((error: unknown) => { throw ServiceErrorHandler(error) })
}

/**
 * Retrieves the delivery specifications for a venue from dynamic venue data.
 * @param venueSlug - url slug for venue.
 * @returns A promise that resolves to the venue's delivery specifications as an `IDeliverySpecs` object.
 * 
 * @throws {DOPCError} thrown DOPCError if request or validation fails.
 */
const getDeliverySpecs = (venueSlug: string): Promise<IDeliverySpecs> => {
    return get_venue_dynamic(venueSlug)
        // assuming that all the fields mentioned are always present in the response payload
        .then((data: IDynamicVenue): IDeliverySpecs => data.venue_raw.delivery_specs)
        .then((specs: IDeliverySpecs): IDeliverySpecs => schemas.IDeliverySpecsSchema.parse(specs))
        .catch((error: unknown) => { throw ServiceErrorHandler(error) })
}


export default {
    get_venue_static,
    get_venue_dynamic,
    getVenueLocation,
    getDeliverySpecs
}