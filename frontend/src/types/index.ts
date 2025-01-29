

export interface Location {
    latitude: number,
    longitude: number
}

export interface IDopcFields {
    venueSlug: string,
    cartValue: number,
    userLatitude: number,
    userLongitude: number
}

export interface IDopcOut {
    cartValue: number,
    smallOrderSurcharge: number,
    deliveryFee: number,
    deliveryDistance: number,
    totalPrice: number
}
