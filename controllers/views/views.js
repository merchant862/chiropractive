require('dotenv').config();

const { getAllSlugs, getProductBySlug } = require("../../database/services/products");

const renderPage = (view, pageName, statusCode) =>
  {
    return async (req, res, next) =>
    {
      try
      {
        if (req.path.startsWith('/shop'))
        {
          const productSlugs = await getAllSlugs();
          const allowedProducts = productSlugs.map(item => item.slug);

          /* const allowedProducts =
          [
            'orthopedic_cervical_pillow',
            'posture_corrector_belt',
            'lumbar_support_cushion',
            'therapy_massage_tool'
          ]; */
  
          const { product } = req.params;
  
          if (!product) return next();
  
          if (!allowedProducts.includes(product)) return next();
        }
  
        return res
          .status(statusCode)
          .render(`../views/${view}.ejs`,
          {
            SITE_TITLE: process.env.SITE_TITLE,
            PAGE_NAME: pageName,
            PRODUCT: req.params.product || null,
            PRODUCT_DETAILS: req.params.product != null ? await getProductBySlug(req.params.product) : null
          });
  
      }
      catch (e)
      {
        next(e);
      }
    };
  };
  
      
module.exports = 
{
  indexController:       renderPage('index', 'Home', 200),
  shopSingleController:  renderPage('shop-single', 'Shop', 200),
  aboutController:       renderPage('about', 'About', 200),
  cartController:        renderPage('cart', 'Cart', 200),
  checkoutController:    renderPage('checkout', 'Checkout', 200),

  controller404:         renderPage('404', '404', 404),
  controller500:         renderPage('500', '500', 500),
};
