const express = require('express');
const router  = express.Router();

const views = require('../controllers/views/views');

const getAllProductsController   = require('../controllers/actions/getAllProducts');
const getProductBySlugController = require('../controllers/actions/getProductBySlug');

router.get('/',              views.indexController);
router.get('/shop/:product', views.shopSingleController);
router.get('/about',         views.aboutController);
router.get('/cart',          views.cartController);
router.get('/checkout',      views.checkoutController);

router.get('/404', views.controller404);
router.get('/500', views.controller500);

router.get('/api/products',      getAllProductsController);
router.get('/api/product/:slug', getProductBySlugController)

module.exports = router;
