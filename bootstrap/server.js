require('dotenv').config();

const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus().length;

const app = require('./app');

//-------------------------------------------

if(process.env.NODE_ENV == 'production')
{
    if(cluster.isPrimary)
    {   
        for(let x = 0; x < cpus; x++) { cluster.fork(); }
        cluster.on('exit',(worker, code, signal) => { cluster.fork(); });
    }

    else
    {
        app.listen(process.env.PORT, async() => 
        {
            console.log('\nProduction Environment\n')
            console.log(`App running on http://localhost:${process.env.PORT}`)
        })
    }
}

else
{
    app.listen(process.env.PORT, async() => 
    {   
        console.log('\nDevelopment Environment\n')
        console.log(`App running on http://localhost:${process.env.PORT}`)
    })
}