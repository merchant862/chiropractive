const express = require('express');
const router  = express.Router();

const views = require('../controllers/views/views');

router.get('/',        views.indexController);
router.get('/shop',    views.shopSingleController);
router.get('/about',   views.aboutController);
router.get('/cart',    views.cartController);
router.get('/checkout',views.checkoutController);

router.get('/404',     views.controller404);
router.get('/500',     views.controller500);

module.exports = router;
