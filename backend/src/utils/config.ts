// Retrives and prepares environment variables.
import env from 'dotenv';
env.config();

import { z } from 'zod';
const NodeEnvSchema = z.enum(["test", "development", "production"]);



let res;

res = NodeEnvSchema.safeParse(process.env.NODE_ENV?.toLowerCase());
const ENV = res.success? res.data : 'production';

res = z.coerce.number().int().positive().safeParse(process.env.PORT );
const PORT = res.success ? res.data : 3000;

res = z.string().regex(/^\/api\/v[0-9]+\/[a-z0-9]+(?:-[a-z0-9]+)*$/).safeParse(process.env.DELIVERY_PRICE_ROUTE);
const DELIVERY_PRICE_ROUTE = res.success ? res.data : '/api/v1/delivery-order-price';

const VENUE_SERVICE_URL = process.env.VENUE_SERVICE_URL || 'https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues';
export default {
    ENV,
    PORT,
    DELIVERY_PRICE_ROUTE,
    VENUE_SERVICE_URL
};