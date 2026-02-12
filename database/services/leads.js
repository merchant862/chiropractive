require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

const { Sequelize } = require("sequelize");
const Models = require("./../models");
const leads = Models.leads;
const Op = Sequelize.Op;

async function addLead(payload) 
{
  try 
  {
    const newLead = await leads.create(payload);
    return JSON.parse(JSON.stringify(newLead));
  } 
  catch (error) { throw error }
}

async function findLeadByToken(lead_token) {
    try {
        const lead = await leads.findOne({
            where: { lead_token },
            attributes: [
                'lead_token',
                'billingFirstName',
                'billingLastName',
                'billingCountry',
                'billingAddress',
                'billingPostalCode',
                'billingCity',
                'billingState',
                'billingEmail',
                'billingPhone',
                //'shipToDifferentAddress', // uncommented
                'shippingFirstName',
                'shippingLastName',
                'shippingCountry',
                'shippingAddress',
                'shippingPostalCode',
                'shippingCity',
                'shippingState',
                'shippingEmail',
                'shippingPhone',
            ]
        });
        return lead ? lead.get({ plain: true }) : null;
    } catch(error) { throw error }
}


const updateLeadByToken = async (lead_token, data) => 
{
    try 
    {
        const [updatedRowsCount] = await leads.update({ ...data }, { where: { lead_token }});

        if (updatedRowsCount === 0) return null;

        const updatedLead = await leads.findOne({ where: { lead_token } });
        return updatedLead;
    } 
    catch(error) { throw error }
};

async function addOrUpdateLeadSafe(data) {
  const transaction = await leads.sequelize.transaction();

  try {
    // ensure lead_token exists
    if (!data.lead_token) data.lead_token = uuidv4();

    const existingLeads = await leads.findAll({
      where: {
        [Op.or]: [
          { billingEmail: data.billingEmail },
          { billingPhone: data.billingPhone }
        ]
      },
      transaction
    });

    const newDataFilled = Object.values(data).filter(v => v !== undefined && v !== null && v !== "").length;

    let leadToKeep = null;
    let maxFilled = newDataFilled;

    for (const l of existingLeads) {
      const filled = Object.values(l.get()).filter(v => v !== undefined && v !== null && v !== "").length;
      if (filled > maxFilled) {
        maxFilled = filled;
        leadToKeep = l;
      }
    }

    if (leadToKeep) {
      if (newDataFilled > Object.values(leadToKeep.get()).filter(v => v).length) {
        await leads.update(data, { where: { lead_token: leadToKeep.lead_token }, transaction });
      }
    } else {
      if (!data.lead_token) data.lead_token = uuidv4();  // safety
      leadToKeep = await leads.create(data, { transaction });
    }

    for (const l of existingLeads) {
      if (l.lead_token !== leadToKeep.lead_token) {
        await leads.destroy({ where: { lead_token: l.lead_token }, transaction });
      }
    }

    await transaction.commit();
    return leadToKeep;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}


async function destroyDuplicateLeads(data) {

  const allLeads = await leads.findAll({
    where: {
      [Op.or]: [
        { billingEmail: data.billingEmail },
        { billingPhone: data.billingPhone }
      ]
    }
  });

  if (!allLeads.length) {
    console.log("❌ No duplicate leads found");
    return;
  }

  console.log(`\n🔎 Found ${allLeads.length} matching leads\n`);

  let maxFilled = 0;
  let leadToKeep = null;

  for (const l of allLeads) {

    const raw = l.get({ plain: true });

    // filter: null, undefined, empty string, whitespace ignore
    const filledFields = Object.entries(raw).filter(([key, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    });

    const filledCount = filledFields.length;

    console.log("-----------");
    console.log("Lead Token:", raw.lead_token);
    console.log("Filled Count:", filledCount);
    console.log("Filled Fields:", filledFields.map(f => f[0]));
    console.log("-----------\n");

    if (filledCount > maxFilled) {
      maxFilled = filledCount;
      leadToKeep = l;
    }
  }

  if (!leadToKeep) {
    console.log("⚠️ No lead selected to keep");
    return;
  }

  console.log(`\n✅ Keeping Lead: ${leadToKeep.lead_token}`);
  console.log(`Max Filled Fields: ${maxFilled}\n`);

  // delete others
  for (const l of allLeads) {
    if (l.lead_token !== leadToKeep.lead_token) {
      console.log("🗑 Deleting:", l.lead_token);
      await leads.destroy({
        where: { lead_token: l.lead_token }
      });
    }
  }

  console.log("✔ Duplicate cleanup complete\n");
}

module.exports = 
{
  addLead,
  findLeadByToken,
  updateLeadByToken,
  addOrUpdateLeadSafe,
  destroyDuplicateLeads
};
