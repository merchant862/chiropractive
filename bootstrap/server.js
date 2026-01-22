require('dotenv').config();
const cluster = require('cluster');
const os = require('os');
const cpus = os.cpus().length;

const app = require('./app');

const PORT = process.env.PORT;

if (process.env.NODE_ENV === 'production') {
    if (cluster.isPrimary) {
        console.log(`Primary ${process.pid} is running`);
        console.log(`Forking ${cpus} workers...`);

        // Fork workers
        for (let i = 0; i < cpus; i++) cluster.fork();

        // Worker crash handling
        cluster.on('exit', (worker, code, signal) => {
            console.warn(`Worker ${worker.process.pid} died (code: ${code}, signal: ${signal})`);
            // Wait 1s before forking new worker to avoid crash loops
            setTimeout(() => cluster.fork(), 1000);
        });
    } else {
        const server = app.listen(PORT, () => {
            console.log(`Worker ${process.pid} started - listening on http://localhost:${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log(`Worker ${process.pid} shutting down...`);
            server.close(() => process.exit(0));
        });

        process.on('SIGINT', () => {
            console.log(`Worker ${process.pid} interrupted...`);
            server.close(() => process.exit(0));
        });
    }
} else {
    // Development mode - single process
    app.listen(PORT, () => {
        console.log(`Development Environment`);
        console.log(`App running on http://localhost:${PORT}`);
    });
}
