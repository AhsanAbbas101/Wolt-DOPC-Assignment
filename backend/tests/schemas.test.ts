import { IDopcParamsSchema } from "../src/utils/schemas";

describe('schemas', () => {

    // testing venue slug for regex.  ascii only
    // Rest of the validation schemas are pretty straightforward.
    describe('IDopcParamsSchema', () => {
        it('validate values for venue slug', () => {
            const venueSchema = IDopcParamsSchema.shape.venue_slug;
            
            expect(()=>venueSchema.parse('a')).not.toThrow();
            expect(()=>venueSchema.parse('1')).not.toThrow();

            expect(()=>venueSchema.parse('a-a')).not.toThrow();
            expect(()=>venueSchema.parse('1-1')).not.toThrow();

            expect(()=>venueSchema.parse('')).toThrow();
            expect(()=>venueSchema.parse('-')).toThrow();
            expect(()=>venueSchema.parse('-a')).toThrow();
            expect(()=>venueSchema.parse('a-')).toThrow();
            expect(()=>venueSchema.parse('-a-')).toThrow();
            
            expect(()=>venueSchema.parse('-1')).toThrow();
            expect(()=>venueSchema.parse('1-')).toThrow();
            expect(()=>venueSchema.parse('-1-')).toThrow();
            
            expect(()=>venueSchema.parse('url-+a')).toThrow();
            expect(()=>venueSchema.parse('__')).toThrow();
            expect(()=>venueSchema.parse('--')).toThrow();
        });
    });

    
});