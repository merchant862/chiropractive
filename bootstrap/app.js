require('dotenv').config();

//-------------------------------------------
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const router = require('../routes/routes.js');
const { xPoweredByHeaders, serverHeaders } = require('../utils/responseHeaders.js');

const app = express();

//-------------------------------------------
// View engine
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'ejs');

//-------------------------------------------
// Middleware
app.use(logger(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Cookies
app.use(cookieParser());

// Security headers
//app.use(helmet());

// Optional: custom headers
app.use(serverHeaders);
app.use(xPoweredByHeaders);

// Compression
app.use(compression());

//-------------------------------------------
// Static files with cache
const oneDay = 96 * 60 * 60 * 1000; // 1 day
app.use('/', express.static(path.join(__dirname, '..', 'public'), { maxAge: oneDay }));
app.use('/shop', express.static(path.join(__dirname, '..', 'public'), { maxAge: oneDay }));

//-------------------------------------------
// CORS
app.use(cors({ origin: true, credentials: true }));
/* if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: true, credentials: true }));
} else {
    // Production: restrict origin to your domain
    app.use(cors({ origin: ['https://yourdomain.com'], credentials: true }));
} */

//-------------------------------------------
// Routes
app.use('/', router);

//-------------------------------------------
// 404 handler
app.use((req, res, next) => {
    res.status(404);
    // If API request, return JSON
    if (req.originalUrl.startsWith('/api/')) {
        return res.json({ error: 'Route not found' });
    }
    res.redirect('/404');
});

// 500 handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    if (req.originalUrl.startsWith('/api/')) {
        return res.json({ error: 'Internal server error' });
    }
    res.redirect('/500');
});

//-------------------------------------------
module.exports = app;
