const { getAllProducts } = require('../../database/services/products');

const encodeImageToBase64 = require('../../utils/encodeImageTobase64');

async function getAllProductsController(req, res, next) 
{
  try 
  {
    let products = await getAllProducts();
    
    products = await Promise.all(
        products.map(async product => (
        {
            ...product,
            image: product.image ? await encodeImageToBase64(product.image) : null
        }))
    );

    return res.status(200).json(
    {
      success: true,
      count: products.length,
      data: products
    });
  } 
  
  catch (error) { next(error) }
}

module.exports = getAllProductsController;