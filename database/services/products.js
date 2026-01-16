require('dotenv').config();

const Models = require('./../models');
const products = Models.products;

async function getAllProducts() 
{
  try 
  {
    const allProducts = await products.findAll({ attributes: { exclude: ['id','createdAt', 'updatedAt'] } });
    return JSON.parse(JSON.stringify(allProducts));
  } 
  catch (error) { throw error }
}

async function getProductBySlug(slug) 
{
  try 
  {
    const product = await products.findOne({ where: { slug }, attributes: { exclude: ['id','createdAt', 'updatedAt'] } });
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } 
  catch (error) { throw error}
}

async function getAllSlugs() 
{
  try 
  {
    const allSlugs = await products.findAll({ attributes: ['slug'] });
    return JSON.parse(JSON.stringify(allSlugs));
  } 
  catch (error) { throw error }
}

module.exports = 
{
  getAllProducts,
  getProductBySlug,
  getAllSlugs
};
