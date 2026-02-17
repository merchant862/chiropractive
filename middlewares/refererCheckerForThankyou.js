const refererCheckerForThankyou = async function(req, res, next) 
{
    const referer = req.get('Referer') || '';
    
    if (referer.includes('/checkout')) return next();

    else return res.redirect('/');
};

module.exports = refererCheckerForThankyou;