require('dotenv').config();
const limiter = require('express-rate-limit');

const limit = (minutes, number, message) => limiter(
{
    windowMs: minutes * 60 * 1000, // window in ms
    max: number, // max requests in the window
    //store: new limiter.MemoryStore({ clearInterval: 60 * 60 * 1000 }), // clear every 1 hour
    standardHeaders: process.env.NODE_ENV === 'development' ? true : false, // X-RateLimit-* headers
    legacyHeaders: process.env.NODE_ENV === 'development' ? true : false,   // X-RateLimit-Limit / X-RateLimit-Remaining

    handler: function (req, res, next) 
    {
        try 
        {
            const ENV = process.env.NODE_ENV;
            if (ENV === 'development') return next();
            return res.status(429).json({ 'error': message });
        } 
        catch (error) { next(error) }
    }
});

module.exports = limit;
