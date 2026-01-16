const { getProductBySlug } = require('../../database/services/products');

const encodeImageToBase64 = require('../../utils/encodeImageTobase64');
const sanitizeProductName = require('../../utils/sanitizeProductName');

async function getProductBySlugController(req, res, next) 
{
  try 
  {
    const rawSlug = req.params.slug;

    const safeSlug = sanitizeProductName(rawSlug);

    if (!safeSlug) return res.status(400).json( { success: false, message: 'Invalid product name' });

    let product = await getProductBySlug(safeSlug);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.image) product.image = await encodeImageToBase64(product.image);

    return res.status(200).json(
    {
      success: true,
      data: product
    });

  } 
  catch (error) { next(error) }
}

module.exports = getProductBySlugController;
