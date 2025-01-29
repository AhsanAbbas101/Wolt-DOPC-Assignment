import config from './utils/config';
import app from './app';
import logger from './utils/logger';


// configure port and start listening on the said port.
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  logger.info(`Server running at Port ${PORT} in ${config.ENV} mode.`);
  logger.info(`DOPC endpoint: ${config.DELIVERY_PRICE_ROUTE}`);
});

// functions for graceful shutdown.
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  server.close(() => {
    logger.info('Server shutting down...');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received.');
  server.close(() => {
    logger.info('Server shutting down...');
    process.exit(0);

  });
});
