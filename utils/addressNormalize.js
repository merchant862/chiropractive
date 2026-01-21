function normalizeAddress(address) 
{
    if (!address) return null;

    let a = address.trim();

    a = a.replace(/\s+/g, " ");
    a = a.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

    const map = 
    {
        "\\bstreet\\b": "St",
        "\\bavenue\\b": "Ave",
        "\\broad\\b": "Rd",
        "\\bboulevard\\b": "Blvd",
        "\\bdrive\\b": "Dr",
        "\\blane\\b": "Ln",
        "\\bapartment\\b": "Apt",
        "\\bsuite\\b": "Ste",
        "\\bunit\\b": "Unit",
    };

    for (const [k, v] of Object.entries(map)) 
    {
        a = a.replace(new RegExp(k, "gi"), v);
    }

    return a;
}

function isValidAddress(address) 
{
    if (!address) return false;
    if (address.length < 5 || address.length > 120) return false;
    if (!/\d/.test(address)) return false;
    if (/[@<>$%^*{}[\]|]/.test(address)) return false;
    
    return true;
}

module.exports = 
{
  normalizeAddress,
  isValidAddress
};
