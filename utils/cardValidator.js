const fs = require('fs');
const path = require('path');
const cardValidator = require('card-validator');

const FILE_PATH = path.join(__dirname, './cards.txt');

function checkCards() {
  const file = fs.readFileSync(FILE_PATH, 'utf8');

  const lines = file
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));

  const results = [];

  for (const line of lines) {
    const [brand, number, expMonth, expYear, cvv] =
      line.split('|').map(v => v.trim());

    const numberCheck = cardValidator.number(number);
    const expiryCheck = cardValidator.expirationDate({
      month: expMonth,
      year: expYear,
    });
    const cvvCheck = cardValidator.cvv(cvv, numberCheck.card?.code?.size);

    const isValid =
      numberCheck.isValid &&
      expiryCheck.isValid &&
      cvvCheck.isValid;

    results.push({
      brand,
      number,
      expMonth,
      expYear,
      cvv,
      valid: isValid,
      errors: {
        number: numberCheck.isValid ? null : 'Invalid card number',
        expiry: expiryCheck.isValid ? null : 'Expired / invalid expiry',
        cvv: cvvCheck.isValid ? null : 'Invalid CVV',
      },
    });
  }

  return results;
}

// run directly
if (require.main === module) {
  const results = checkCards();
  results.forEach(r => {
    console.log(
      `${r.brand} | ${r.number} => ${r.valid ? '✅ VALID' : '❌ INVALID'}`
    );
    if (!r.valid) console.log('   ', r.errors);
  });
}

module.exports = checkCards;
