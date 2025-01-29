import axios from 'axios';
import { IDynamicVenue, IStaticVenue } from '../src/types/venue';

import config from '../src/utils/config';
import service from '../src/services/venueService';
import { ZodError } from 'zod';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const mockStaticData: IStaticVenue = {
    venue_raw: {
        location: {
            coordinates: [0, 0]
        }
    }
};
const mockDynamicData: IDynamicVenue = {
    venue_raw: {
        delivery_specs: {
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
        }
    }
};


describe('venueService', () => {

    beforeEach(() => {
            jest.clearAllMocks();
    });

    describe('get_venue_static', () => {
        

        it('returns data for valid venue slug', async () => {
            const mockVenueSlug = 'valid-url-slug';
            const mockResponse = mockStaticData;

            mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

            const result = await service.get_venue_static(mockVenueSlug);

            expect(result).toEqual(mockResponse);
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(`${config.VENUE_SERVICE_URL}/${mockVenueSlug}/static`);
        });
        it('throws error for invalid venue slug', async () => {
            const mockVenueSlug = 'invalid-url-slug';
            mockedAxios.get.mockRejectedValueOnce(new Error('error'));

            await expect(service.get_venue_static(mockVenueSlug)).rejects.toThrow('error');

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(`${config.VENUE_SERVICE_URL}/${mockVenueSlug}/static`);

        });
    });


    describe('get_venue_dynamic', () => {

        it('returns data for valid venue slug', async () => {
            const mockVenueSlug = 'valid-url-slug';
            const mockResponse = mockDynamicData;
            mockedAxios.get.mockResolvedValueOnce({ data: mockResponse });

            const result = await service.get_venue_dynamic(mockVenueSlug);

            expect(result).toEqual(mockResponse);
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(`${config.VENUE_SERVICE_URL}/${mockVenueSlug}/dynamic`);
        });
        it('throws error for invalid venue slug', async () => {
            const mockVenueSlug = 'invalid-url-slug';
            mockedAxios.get.mockRejectedValueOnce(new Error('error'));

            await expect(service.get_venue_dynamic(mockVenueSlug)).rejects.toThrow('error');

            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(mockedAxios.get).toHaveBeenCalledWith(`${config.VENUE_SERVICE_URL}/${mockVenueSlug}/dynamic`);

        });
    });  
    
    describe('getVenueLocation', () => {

        it('returns validated venue location data', async () => {
            const mockVenueSlug = 'valid-url-slug';
            mockedAxios.get.mockResolvedValueOnce({ data: mockStaticData });

            const result = await service.getVenueLocation(mockVenueSlug);

            expect(result).toEqual(mockStaticData.venue_raw.location);
        });

        it('returns zodError on invalid venue location data', async () => {
            const mockVenueSlug = 'valid-url-slug';
            const invalidMockData = { ...mockStaticData };
            invalidMockData.venue_raw.location.coordinates = [1000, -1000];

            mockedAxios.get.mockResolvedValueOnce({ data: invalidMockData });

            await expect(service.getVenueLocation(mockVenueSlug)).rejects.toThrow(ZodError);

        });

        it('returns error on api failure', async () => {
            const mockVenueSlug = 'valid-url-slug';

            mockedAxios.get.mockResolvedValueOnce({ data: {} });

            await expect(service.getVenueLocation(mockVenueSlug)).rejects.toThrow(Error);

        });
    });

    describe('getDeliverySpecs', () => {
        
        it('returns validated venue delivery data', async () => {
            const mockVenueSlug = 'valid-url-slug';
            mockedAxios.get.mockResolvedValueOnce({ data: mockDynamicData });

            const result = await service.getDeliverySpecs(mockVenueSlug);

            expect(result).toEqual(mockDynamicData.venue_raw.delivery_specs);
        });

        it('returns zodError on invalid delivery data', async () => {
            const mockVenueSlug = 'valid-url-slug';
            const invalidMockData = { ...mockDynamicData };
            invalidMockData.venue_raw.delivery_specs.order_minimum_no_surcharge = 1.1;

            mockedAxios.get.mockResolvedValueOnce({ data: invalidMockData });

            await expect(service.getDeliverySpecs(mockVenueSlug)).rejects.toThrow(ZodError);

        });

        it('returns error on api failure', async () => {
            const mockVenueSlug = 'valid-url-slug';

            mockedAxios.get.mockResolvedValueOnce({ data: {} });

            await expect(service.getDeliverySpecs(mockVenueSlug)).rejects.toThrow(Error);

        });
    });
});