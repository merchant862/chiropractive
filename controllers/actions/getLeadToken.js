const { findLeadByToken } = require('../../database/services/leads');

const getPartialLead = async (req, res, next) => 
{
  try 
  {
    const { token } = req.params;

    const lead = await findLeadByToken(token)

    if (!lead) return res.status(404).json({ success: false, error: 'Partials not found' });

    return res.json({ success: true, data: lead });

  } 
  catch (err) { next(err) }
};

module.exports = getPartialLead;