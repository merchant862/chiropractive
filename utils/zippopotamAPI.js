require('dotenv').config();

async function zippopotamAPI({country, postalCode}) 
{
  try
  {
    const response = await fetch(`${process.env.ZIPPOPOTAM_API_BASE_URL}/${country}/${postalCode}`);
    const data = await response.json();
    return data;
  }
  catch(error) { throw err };
}

/* (async() => 
{
    await zippopotamAPI({country:'US',postalCode:'78905'})
})() */

module.exports = zippopotamAPI;
