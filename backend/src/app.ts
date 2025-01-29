import config from './utils/config';
import express from 'express';
import cors from 'cors';
import 'express-async-errors';

// routes
import deliveryPriceRoute from './routes/deliveryPrice';
// middleware
import {unknownEndpoint,errorMiddleware, requestLogger} from './utils/middleware';

const app = express();
app.use(cors());
app.use(express.json());

// logger
if (config.ENV !== 'test')
    app.use(requestLogger);

// register routes

app.get('/', (_req, res) => {
    const msg = `You made it!\n
Avaiable endpoint:\n
- ${config.DELIVERY_PRICE_ROUTE}`;
    res.send(msg);
});

app.use(config.DELIVERY_PRICE_ROUTE, deliveryPriceRoute);

app.use(unknownEndpoint);
app.use(errorMiddleware);


export default app;