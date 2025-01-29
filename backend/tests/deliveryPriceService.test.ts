import { IDopcOut, IDOPCParams } from "../src/types";

import * as service from '../src/services/deliveryPriceService';

import venueService from '../src/services/venueService';
import { IDeliverySpecs, ILocation } from "../src/types/venue";
jest.mock('../src/services/venueService');

const mockParams: IDOPCParams = {
    venue_slug: 'valid-url',
    cart_value: 10,
    user_lat: 0,
    user_lon: 0
};
const mockLocationData: ILocation = {
    coordinates: [0, 0]
};
const mockDeliveryData: IDeliverySpecs = {
    order_minimum_no_surcharge: 0,
    delivery_pricing: {
        base_price: 0,
        distance_ranges: [
            {
                min: 0,
                max: 10,
                a: 0,
                b: 0,
                flag:  null
            },
            {
                min: 10,
                max: 0,
                a: 0,
                b: 0,
                flag:  null
            }]
    }
};

const mockLocationfn = venueService.getVenueLocation as jest.Mock;
const mockDeliveryfn = venueService.getDeliverySpecs as jest.Mock;

describe('deliveryPriceService', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });   

    describe('calculate', () => {

        it('throws error when venue service fails', async () => {
            
            mockLocationfn.mockRejectedValueOnce(new Error('Venue api error'));
            mockLocationfn.mockResolvedValueOnce({} as ILocation);
            
            mockDeliveryfn.mockRejectedValueOnce(new Error('Venue api error'));

            await expect(service.calculate(mockParams)).rejects.toThrow();
            expect(mockLocationfn).toHaveBeenCalledTimes(1);

            await expect(service.calculate(mockParams)).rejects.toThrow();
            expect(mockDeliveryfn).toHaveBeenCalledTimes(1);
        });

        it('throws error when distance is large', async () => {
            mockLocationfn.mockResolvedValue(mockLocationData);
            mockDeliveryfn.mockResolvedValue(mockDeliveryData);

            const params = { ...mockParams, user_lat: 10 };
            
            await expect(service.calculate(params)).rejects.toThrow('Delivery not possible due to max distance.');
            
        });

        it('returns delivery information', async () => {
            mockLocationfn.mockResolvedValue(mockLocationData);
            mockDeliveryfn.mockResolvedValue(mockDeliveryData);  
            
            const expected: IDopcOut = {
                total_price: 10,
                small_order_surcharge: 0,
                cart_value: 10,
                delivery: {
                    fee: 0,
                    distance: 0
                }
            };

            await expect(service.calculate(mockParams)).resolves.toEqual(expected);
        });
       
    });
});
