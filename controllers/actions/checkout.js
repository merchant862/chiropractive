const cardValidator                        = require("../../utils/cardValidator");
const { isValidUSState }                   = require("../../utils/stateCheckerForUS");
const { isValidUSCity }                    = require("../../utils/cityCheckerForUS");
const { normalizeAddress, isValidAddress } = require("../../utils/addressNormalize");

const checkout = (req, res, next) => 
{
    try 
    {
        const b = 
        {
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

        /* ---------------- Billing validation ---------------- */
        for (const [key, value] of Object.entries(b)) 
        {
            if (!value) return res.status(400).json({ error: {"Billing":`${key} is required`} });
        }

        if (!/^\S+@\S+\.\S+$/.test(b["Email"])) return res.status(400).json({ error: {"Billing":"Invalid email"} });
        if (!/^\+1[0-9]{10}$/.test(b["Phone"])) return res.status(400).json({ error: {"Billing":"Invalid phone number"} });
        if (b["Country"] !== "US") return res.status(400).json({ error : {"Billing":"We currently accept orders within the United States only"} })
        if (!isValidUSState(b["State"])) return res.status(400).json({error: { "Billing":"Invalid U.S. state selected" }});
        if (!isValidUSCity(b["City"])) return res.status(400).json({error: { "Billing":"Invalid city name"}}); 
        if (!isValidAddress(b["Address"])) return res.status(400).json({error: { "Billing":"Please enter a valid address"}});
        /* ---------------- Shipping logic ---------------- */
        let shipping;

        const shipDifferent = req.body.shipToDifferentAddress === "on" || req.body.shipToDifferentAddress === "true";

        if (shipDifferent) 
        {
            shipping = 
            {
                "First Name": req.body.shippingFirstName?.trim(),
                "Last Name": req.body.shippingLastName?.trim(),
                "Country": req.body.shippingCountry?.trim(),
                "Address": normalizeAddress(req.body.shippingAddress?.trim()),
                "Postal Code": req.body.shippingPostalCode?.trim(),
                "City": req.body.shippingCity?.trim(),
                "State": req.body.shippingState?.trim(),
                "Email": req.body.shippingEmail?.trim(),
                "Phone": req.body.shippingPhone?.trim(),
            };

            for (const [key, value] of Object.entries(shipping)) 
            {
                if (!value) return res.status(400).json({ error: {"Shipping":`${key} is required`} });
            }

            if (!/^\S+@\S+\.\S+$/.test(shipping["Email"])) return res.status(400).json({ error: {"Shipping":"Invalid email"} });
            if (!/^\+1[0-9]{10}$/.test(shipping["Phone"])) return res.status(400).json({ error: {"Shipping":"Invalid phone number"} }); 
            if (shipping["Country"] !== "US") return res.status(400).json({ error : {"Shipping":"We currently accept orders within the United States only"} })
            if (!isValidUSState(shipping["State"])) return res.status(400).json({error: { "Shipping": "Invalid U.S. state selected" }});    
            if (!isValidUSCity(shipping["City"])) return res.status(400).json({error: {"Shipping": "Invalid city name" }});
            if (!isValidAddress(shipping["Address"])) return res.status(400).json({error: { "Shipping":"Please enter a valid address" }});

        } 
        
        else shipping = { ...b };

        // CARD

        const cardDetails = 
        {
            "Card Number": (req.body.cardNo || "").replace(/\s/g, ""),
            "Card Expiry Month": req.body.cardExpMonth,
            "Card Expiry Year": req.body.cardExpYear,
            "Card CVV/CVC": req.body.cardCVV,
        }

        const cardValidation = cardValidator(
        {
            cardNo: cardDetails['Card Number'],
            cardExpMonth: cardDetails['Card Expiry Month'],
            cardExpYear: cardDetails['Card Expiry Year'],
            cardCVV: cardDetails['Card CVV/CVC']
        });

        if (!cardValidation.valid) return res.status(400).json({ error: cardValidation.errors });
        
        const data =
        {
            billingFirstName: b["First Name"],
            billingLastName: b["Last Name"],
            billingCountry: b["Country"],
            billingAddress: b["Address"],
            billingPostalCode: b["Postal Code"],
            billingCity: b["City"],
            billingState: b["State"],
            billingEmail: b["Email"],
            billingPhone: b["Phone"],
            shippingFirstName: shipping["First Name"],
            shippingLastName: shipping["Last Name"],
            shippingCountry: shipping["Country"],
            shippingAddress: shipping["Address"],
            shippingPostalCode: shipping["Postal Code"],
            shippingCity: shipping["City"],
            shippingState: shipping["State"],
            shippingEmail: shipping["Email"],
            shippingPhone: shipping["Phone"],
            cardNo: cardDetails["Card Number"],
            cardExpMonth: cardDetails["Card Expiry Month"],
            cardExpYear: cardDetails["Card Expiry Year"],
            cardCVV: cardDetails["Card CVV/CVC"],
        };
        //console.log(data)
        return res.json(
        {
            success: true,
            billing: b,
            shipping,
            cardDetails,
            cardMeta: { brand: cardValidation.brand, last4: cardDetails['Card Number'].slice(-4) },
        });

    } 
    catch (err) { next(err) }
};

module.exports = checkout;
