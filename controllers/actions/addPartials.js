// controllers/leadsController.js
const { addOrUpdateLeadSafe } = require('../../database/services/leads');
const { v4: uuidv4 } = require('uuid');

const savePartialLead = async (req, res, next) => 
{
  try 
  {
    const leadToken = req.body.leadToken || uuidv4(); 

    const lead = await addOrUpdateLeadSafe(
    {
      lead_token: leadToken,
      is_partial: true,
      is_paid: false,
      billingFirstName: req.body.billingFirstName,
      billingLastName: req.body.billingLastName,
      billingCountry: req.body.billingCountry,
      billingAddress: req.body.billingAddress,
      billingPostalCode: req.body.billingPostalCode,
      billingCity: req.body.billingCity,
      billingState: req.body.billingState,
      billingEmail: req.body.billingEmail,
      billingPhone: req.body.billingPhone,
      shipToDifferentAddress: req.body.shipToDifferentAddress,
      shippingFirstName: req.body.shippingFirstName,
      shippingLastName: req.body.shippingLastName,
      shippingCountry: req.body.shippingCountry,
      shippingAddress: req.body.shippingAddress,
      shippingPostalCode: req.body.shippingPostalCode,
      shippingCity: req.body.shippingCity,
      shippingState: req.body.shippingState,
      shippingEmail: req.body.shippingEmail,
      shippingPhone: req.body.shippingPhone,
      leadToken, // important
    });

    return res.json({ success: true, leadToken, message: 'Partial processed' });
  } 
  catch (err) { next(err) }
};


module.exports = savePartialLead;
