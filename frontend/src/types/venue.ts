
export interface IRangeObj {
    min: number
    max: number
    a: number
    b: number
    flag: boolean | null
}

export interface ILocation {
    /** [longitude, latitude] */
    coordinates: [number, number] 
}

export interface IDeliveryPricing {
    base_price: number
    distance_ranges: IRangeObj[]
}

export interface IDeliverySpecs {
    order_minimum_no_surcharge: number
    delivery_pricing: IDeliveryPricing
}

export interface IStaticRawVenue {
    location: ILocation
    // ignoring remianing properties
}

export interface IDynamicRawVenue {
    delivery_specs: IDeliverySpecs
    // ignoring remianing properties
}

export interface IStaticVenue {
    venue_raw: IStaticRawVenue
}

export interface IDynamicVenue {
    venue_raw: IDynamicRawVenue
}
