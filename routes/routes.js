const express = require('express');
const router  = express.Router();

const rateLimiter = require('../middlewares/rateLimiter');

const views = require('../controllers/views/views');

const getAllProductsController   = require('../controllers/actions/getAllProducts');
const getProductBySlugController = require('../controllers/actions/getProductBySlug');
const checkoutController         = require('../controllers/actions/checkout');
const getInfoByPostalCode        = require('../controllers/actions/getInfoByPostalCode');

router.get('/',              views.indexController);
router.get('/shop/:product', views.shopSingleController);
router.get('/about',         views.aboutController);
router.get('/cart',          views.cartController);
router.get('/checkout',      views.checkoutController);

router.get('/404', views.controller404);
router.get('/500', views.controller500);

router.get('/api/products',      getAllProductsController);
router.get('/api/product/:slug', getProductBySlugController)
router.get('/api/zip/:code',     rateLimiter(1, 12, "Too many ZIP lookups. Wait a minute."), getInfoByPostalCode)
router.post('/api/checkout',     rateLimiter(10, 6, "Too many checkout attempts. Try later."), checkoutController)

module.exports = router;
