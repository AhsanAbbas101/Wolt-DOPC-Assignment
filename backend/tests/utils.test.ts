import { ZodError } from 'zod';
import { ILocation, IRangeObj } from '../src/types/venue';
import * as utils from '../src/utils';

describe('util functions', () => {

    describe('calculateDistance', () => {
        const createILocation = (long: number, lat: number): ILocation => ({
            coordinates: [long, lat]
        });
        
        
        it('calulates correct distance for two valid locations', () => {
            const loc1: ILocation = createILocation(0,0);
            const loc2: ILocation = createILocation(0,0.1);
            expect(utils.calculateDistance(loc1, loc2))
                .toBeCloseTo(11.12);

        });

        it('calulates zero distance for same valid locations', () => {
            const loc1: ILocation = createILocation(1,1);
            const loc2: ILocation = createILocation(1,1);
            expect(utils.calculateDistance(loc1, loc2))
                .toEqual(0);

        });

        it('throws zodError for invalid location A', () => {
            const loc1: ILocation = createILocation(900,-901);
            const loc2: ILocation = createILocation(1,1);
            expect(() => utils.calculateDistance(loc1, loc2))
                .toThrow(ZodError);
        });
        it('throws zodError for invalid location B', () => {
            const loc1: ILocation = createILocation(1,-1);
            const loc2: ILocation = createILocation(404,1);
            expect(() => utils.calculateDistance(loc1, loc2))
                .toThrow(ZodError);
        });
    });

    describe('selectDistanceRange', () => {
        const ranges : IRangeObj[] = [
            {
                "min": 0,
                "max": 500,
                "a": 0,
                "b": 0,
                "flag": null
            },
            {
                "min": 500,
                "max": 1000,
                "a": 100,
                "b": 1,
                "flag": null
            },
            {
                "min": 1000,
                "max": 0,
                "a": 0,
                "b": 0,
                "flag": null
            }];
        
        it('throws error for negative distance', () => {
            expect(() => utils.selectDistanceRange(-1, ranges))
                .toThrow(Error);
        });
        it('throws error for empty or one object range array', () => {
            expect(() => utils.selectDistanceRange(40, []))
                .toThrow(Error);
            expect(() => utils.selectDistanceRange(40, [{
                "min": 0,
                "max": 500,
                "a": 0,
                "b": 0,
                "flag": null
            }])).toThrow(Error);
        });

        it('returns zero max for exceeded distance', () => {
            expect(utils.selectDistanceRange(2000, ranges)).toMatchObject({ "min": 1000, "max": 0, });
        });

        it('selects correct range for a given distance', () => {
            expect(utils.selectDistanceRange(800, ranges)).toMatchObject({ "min": 500, "max": 1000, });
            expect(utils.selectDistanceRange(100, ranges)).toMatchObject({ "min": 0, "max": 500, });
        });
        it('selects correct range for boundry distances', () => {
            expect(utils.selectDistanceRange(0, ranges)).toMatchObject({ "min": 0, "max": 500, });
            expect(utils.selectDistanceRange(500, ranges)).toMatchObject({ "min": 500, "max": 1000, });
            expect(utils.selectDistanceRange(1000, ranges)).toMatchObject({ "min": 1000, "max": 0, });
        });
    });

    describe('calculateDeliveryPrice', () => {

        it('calculates correct values for given input', () => {
            const result = utils.calculateDeliveryPrice(
                1000, //cartValue
                800, //orderMinimumNoSurcharge
                190, //basePrice
                0, // constantAmount
                0, //multiplier
                177 // deliveryDistance
            );
            expect(result).toEqual({
                total_price: 1190,
                small_order_surcharge: 0,
                cart_value: 1000,
                delivery: {
                    fee: 190,
                    distance: 177
                }
            });
        });

        it('adds surcharge for small orders', () => {
            const result = utils.calculateDeliveryPrice(
                1000, //cartValue
                1200, //orderMinimumNoSurcharge
                190, //basePrice
                0, // constantAmount
                0, //multiplier
                177 // deliveryDistance
            );
            expect(result).toMatchObject({
                small_order_surcharge: 200,
                total_price: 1190+200
            });
        });

        it('calculates total price correctly', () => {
            const result = utils.calculateDeliveryPrice(
                1000, //cartValue
                800, //orderMinimumNoSurcharge
                190, //basePrice
                0, // constantAmount
                0, //multiplier
                177 // deliveryDistance
            );
            expect(result.total_price).toEqual(result.cart_value + result.small_order_surcharge + result.delivery.fee);
        });

        it('calculates correctly for zero distance', () => {
            const result = utils.calculateDeliveryPrice(
                1000, //cartValue
                800, //orderMinimumNoSurcharge
                100, //basePrice
                100, // constantAmount
                2, //multiplier
                0 // deliveryDistance
            );
            expect(result).toMatchObject({
                total_price: 1200,
                delivery: {
                    fee: 200,
                    distance: 0
                }
            });
        });

        
    });
});