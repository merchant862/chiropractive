// controllers/checkoutController.js
const { v4: uuidv4 } = require('uuid');
const cardValidator                        = require("../../utils/cardValidator");
const { isValidUSState }                   = require("../../utils/stateCheckerForUS");
const { isValidUSCity }                    = require("../../utils/cityCheckerForUS");
const { normalizeAddress, isValidAddress } = require("../../utils/addressNormalize");
const sendOrderConfirmationEmail           = require("../../utils/sendOrderConfirmationEmail");
const detectCardBrand                      = require("../../utils/detectCardBrand");

const { addOrUpdateLeadSafe, findLeadByToken, destroyDuplicateLeads } = require("../../database/services/leads");

const checkout = async (req, res, next) => {
  try {
    // ---------------- Billing ----------------
    const billing = {
      "First Name": req.body.billingFirstName?.trim(),
      "Last Name": req.body.billingLastName?.trim(),
      "Country": req.body.billingCountry?.trim(),
      "Address": normalizeAddress(req.body.billingAddress?.trim()),
      "Postal Code": req.body.billingPostalCode?.trim(),
      "City": req.body.billingCity?.trim(),
      "State": req.body.billingState?.trim(),
      "Email": req.body.billingEmail?.trim(),
      "Phone": req.body.billingPhone?.trim(),
    };

    for (const [key, value] of Object.entries(billing)) {
      if (!value) return res.status(400).json({ error: { Billing: `${key} is required` } });
    }

    if (!/^\S+@\S+\.\S+$/.test(billing["Email"]))
      return res.status(400).json({ error: "Invalid billing email" });
    if (!/^\+1[0-9]{10}$/.test(billing["Phone"]))
      return res.status(400).json({ error: "Invalid billing phone number" });
    if (billing["Country"] !== "US")
      return res.status(400).json({ error: "We currently accept orders within the United States only" });
    if (!isValidUSState(billing["State"]))
      return res.status(400).json({ error: "Invalid U.S. state selected for billing" });
    if (!isValidUSCity(billing["City"]))
      return res.status(400).json({ error: "Invalid billing city name" });
    if (!isValidAddress(billing["Address"]))
      return res.status(400).json({ error: "Please enter a valid billing address" });

    // ---------------- Shipping ----------------
    const shipDifferent = req.body.shipToDifferentAddress === "on" || req.body.shipToDifferentAddress === "true";
    let shipping = shipDifferent
      ? {
          "First Name": req.body.shippingFirstName?.trim(),
          "Last Name": req.body.shippingLastName?.trim(),
          "Country": req.body.shippingCountry?.trim(),
          "Address": normalizeAddress(req.body.shippingAddress?.trim()),
          "Postal Code": req.body.shippingPostalCode?.trim(),
          "City": req.body.shippingCity?.trim(),
          "State": req.body.shippingState?.trim(),
          "Email": req.body.shippingEmail?.trim(),
          "Phone": req.body.shippingPhone?.trim(),
        }
      : { ...billing };

    if (shipDifferent) {
      for (const [key, value] of Object.entries(shipping)) {
        if (!value) return res.status(400).json({ error: { Shipping: `${key} is required` } });
      }

      if (!/^\S+@\S+\.\S+$/.test(shipping["Email"]))
        return res.status(400).json({ error: "Invalid billing email" });
      if (!/^\+1[0-9]{10}$/.test(shipping["Phone"]))
        return res.status(400).json({ error: "Invalid billing phone number" });
      if (shipping["Country"] !== "US")
        return res.status(400).json({ error: "We currently accept orders within the United States only" });
      if (!isValidUSState(shipping["State"]))
        return res.status(400).json({ error: "Invalid U.S. state selected for shipping" });
      if (!isValidUSCity(shipping["City"]))
        return res.status(400).json({ error: "Invalid shipping city name" });
      if (!isValidAddress(shipping["Address"]))
        return res.status(400).json({ error: "Please enter a valid shipping address" });
    }

    // ---------------- Card ----------------
    const card = {
      cardNo: (req.body.cardNo || "").replace(/\s/g, ""),
      cardExpMonth: req.body.cardExpMonth,
      cardExpYear: req.body.cardExpYear,
      cardCVV: req.body.cardCVV,
    };

    const hasCard = !!card.cardNo;

    if (hasCard) {
      const cardValid = cardValidator(card);
      if (!cardValid.valid) return res.status(400).json({ error: Object.values(cardValid.errors).join(", ") });
    }

    // ---------------- Lead Data ----------------
    let leadToken = req.body.leadToken || uuidv4();
    const existingLead = req.body.leadToken ? await findLeadByToken(req.body.leadToken) : null;
    if (existingLead) leadToken = existingLead.leadToken;

    const leadData = {
      leadToken,
      billingFirstName: billing["First Name"],
      billingLastName: billing["Last Name"],
      billingCountry: billing["Country"],
      billingAddress: billing["Address"],
      billingPostalCode: billing["Postal Code"],
      billingCity: billing["City"],
      billingState: billing["State"],
      billingEmail: billing["Email"],
      billingPhone: billing["Phone"],
      shippingFirstName: shipping["First Name"],
      shippingLastName: shipping["Last Name"],
      shippingCountry: shipping["Country"],
      shippingAddress: shipping["Address"],
      shippingPostalCode: shipping["Postal Code"],
      shippingCity: shipping["City"],
      shippingState: shipping["State"],
      shippingEmail: shipping["Email"],
      shippingPhone: shipping["Phone"],
      is_partial: !hasCard,
      is_paid: hasCard,
      paid_at: hasCard ? new Date() : null,
      ...(hasCard
        ? {
            cardNo: card.cardNo,
            cardExpMonth: card.cardExpMonth,
            cardExpYear: card.cardExpYear,
            cardCVV: card.cardCVV,
          }
        : {}),
    };

    /* await destroyDuplicateLeads(
    {
      billingEmail: billing["Email"],
      billingPhone: billing["Phone"],
    }) */
    // ---------------- Save / Update ----------------
    const savedLead = await addOrUpdateLeadSafe(leadData);

    res.status(200).json({
        success: hasCard ? "Checkout completed" : "Partial data saved",
        leadToken: savedLead.lead_token,
    });

    let data = 
    {
        cartFromFrontEnd : req.body.cart,
        email: billing["Email"],
        cardBrand: detectCardBrand(req.body.cardNo),
        cardLast4: (req.body.cardNo).slice(-4),
        name: `${billing["First Name"]} ${billing["Last Name"]}`,
        address1: `${billing["Address"]}`,
        state: `${billing["State"]}`,
        city: `${shipping["City"]}`,
        zip: `${shipping["Postal Code"]}`,
        country: 'USA',
    }

    await sendOrderConfirmationEmail(data);
  } catch (err) {
    next(err);
  }
};

module.exports = checkout;
