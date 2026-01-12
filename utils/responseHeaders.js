const xPoweredByHeaders = function (req, res, next) 
{
    let agents = ["PHP 8.1.0","Express","Next.js","ASP.NET","Ruby on Rails","Perl 5.0","Java EE"];
    let agent = agents[ Math.floor(Math.random() * agents.length) ];
    res.setHeader('X-Powered-By',agent);
    next()
}

const serverHeaders = function (req, res, next) 
{
    let agents = ["Microsoft IIS","nginx","Apache (Arch)","Apache Tomcat","Cloudflare","Fastly","CloudFront"];
    let agent = agents[ Math.floor(Math.random() * agents.length) ];
    res.setHeader('Server',agent);
    next()
}

module.exports = 
{
    xPoweredByHeaders,
    serverHeaders
}

