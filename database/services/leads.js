require('dotenv').config();

const Models = require('./../models');
const leads = Models.leads;

async function addLead(payload) 
{
  try 
  {
    const newLead = await leads.create(payload);

    return JSON.parse(JSON.stringify(newLead));
  } 
  
  catch (error) { throw error }
}

module.exports = 
{
  addLead
};
