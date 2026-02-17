const CARD_BRANDS = 
[
    {name:"visa", regex:/^4/, lengths:[16], cvv:3},
    {name:"mastercard", regex:/^5[1-5]/, lengths:[16], cvv:3},
    {name:"amex", regex:/^3[47]/, lengths:[15], cvv:4},
    {name:"discover", regex:/^6(?:011|5)/, lengths:[16], cvv:3},
    {name:"jcb", regex:/^35/, lengths:[16], cvv:3},
    {name:"unionpay", regex:/^62/, lengths:[16,17,18,19], cvv:3},
    {name:"dc", regex:/^3(?:0|6|8)/, lengths:[14], cvv:3}
];

function detectCardBrand(cardNumber) 
{
    return CARD_BRANDS.find(brand => brand.regex.test(cardNumber))?.name || "unknown";
}

module.exports = detectCardBrand;