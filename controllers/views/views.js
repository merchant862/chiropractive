require('dotenv').config();

const renderPage = (view, pageName, statusCode) => 
{
  return async (req, res, next) => 
  {
    try 
    {
      if (req.path === '/shop') 
      {
        const allowedProducts = 
        [
          'orthopedic_cervical_pillow',
          'posture_corrector_belt',
          'lumbar_support_cushion',
          'tharapy_massage_tool'
        ];

        const queryKeys = Object.keys(req.query);

        if (queryKeys.length === 0) 
        {
          const err = new Error('Product query is required');
          next(err);
        }

        if (queryKeys.length !== 1 || queryKeys[0] !== 'product') 
        {
          const err = new Error('Invalid query parameter');
          next(err);
        }

        const product = req.query.product;

        if (!allowedProducts.includes(product)) 
        {
          const err = new Error('Invalid product value');
          next(err);
        }
      }

      return res
        .status(statusCode)
        .render(`../views/${view}.ejs`, 
        {
          SITE_TITLE: process.env.SITE_TITLE,
          PAGE_NAME: pageName
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
