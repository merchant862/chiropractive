const zippopotamAPI = require('../../utils/zippopotamAPI');

async function getInfoByPostalCodeController(req, res, next) 
{
  try 
  {
    const { code } = req.params;

    if (!code || isNaN(code) || code.length > 5 || code.length < 5) return res.status(400).json({ error: {"Postal Code":"Please enter a valid 5-digit US postal code"} });

    let zipInfo = await zippopotamAPI({ country:"US",postalCode:code })
    
    if(Object.keys(zipInfo).length == 0) return res.status(400).json({ error: {"Postal Code":"No location found for this postal code. Please check and try again."} });

    return res.status(200).json(
    {
      success: true,
      data: zipInfo
    });

  } 
  catch (error) { next(error) }
}

module.exports = getInfoByPostalCodeController;
