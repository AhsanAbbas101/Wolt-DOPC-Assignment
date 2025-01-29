import config from '../src/utils/config';
import request from 'supertest';
import app from '../src/app';

const ROUTE_URL = config.DELIVERY_PRICE_ROUTE;

import * as service from '../src/services/deliveryPriceService';
jest.mock('../src/services/deliveryPriceService');

describe('Delivery Price Route', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    

    describe('GET /', () => {

        const query = {
                user_lon: '0',
                user_lat: '0',
                cart_value: '0',
                venue_slug: 'url-here',
        };
    
        it('sends 200 and data for service success',  async () => {
            
            const mockResult = {
                total_price: 0,
                small_order_surcharge: 0,
                cart_value: 0,
                delivery: {
                    fee: 0,
                    distance: 0
                }
            };

            
            (service.calculate as jest.Mock).mockResolvedValue(mockResult);

            const response = await request(app).get(ROUTE_URL).query(query);
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockResult);

        });

        it('sends 500 code and error for service failure', async () => {
            
            (service.calculate as jest.Mock).mockRejectedValue(new Error('error'));

            const response = await request(app).get(ROUTE_URL).query(query);
            expect(response.status).toBe(500);
            

        });
    });
  
});