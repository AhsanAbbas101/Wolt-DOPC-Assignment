
/**
 * Log information to console
 * @param params values to log
 */
const info = (...params: unknown[]) => {
    if (process.env.NODE_ENV !== 'test'){
        console.log(...params);
    }
};

/**
 * Log error to console
 * @param params values to log
 */
const error = (...params: unknown[]) => {
    if (process.env.NODE_ENV !== 'test'){
        console.error(...params);
    }
};

export default {
    info,
    error
};