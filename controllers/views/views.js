require('dotenv').config();

const renderPage = (view, pageName, statusCode) => 
{
  return async (req, res, next) => 
  {
    try 
    {
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
