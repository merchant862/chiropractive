const cardValidator = require("card-validator");

function validateCard({ cardNo, cardExpMonth, cardExpYear, cardCVV }) 
{
  const result = 
  { valid: true, brand: null, errors: {} };

    // CARD NUMBER
    const numberCheck = cardValidator.number(cardNo);
    
    if (!numberCheck.isValid) 
    {
        result.valid = false;
        result.errors.cardNo = "Invalid card number";
    } 
    
    else result.brand = numberCheck.card.type;

    // EXPIRY
    const expiryCheck = cardValidator.expirationDate({ month: cardExpMonth, year: cardExpYear });
    
    if (!expiryCheck.isValid) 
    {
        result.valid = false;
        result.errors.expiry = "Card expired or invalid expiry date";
    }

    // CVV
    const cvvCheck = cardValidator.cvv( cardCVV, numberCheck.card?.code?.size );
    
    if (!cvvCheck.isValid) 
    {
        result.valid = false;
        result.errors.cvv = "Invalid CVV";
    }

    return result;
}

module.exports = validateCard;
