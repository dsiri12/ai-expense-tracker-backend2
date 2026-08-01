import app from "./app";
import { db } from "./config/db";
import {env} from './config/env'

const PORT = env.PORT

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


let isShuttingDown = false;
// Listen for termination signals
const shutdown = (signal: string) => {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;
    console.log(`Received ${signal}. Starting graceful shutdown...`);

    // 1. Stop accepting new connections
    // server.close() tells Node: Stop accepting new incoming connections from api clients
    // Once the server is closed, the callback runs:
    server.close(async () => {
        console.log('HTTP server closed.');

        try {
            // 2. Close database connections cleanly
            await db.end();
            
            console.log('Database connections closed.');

            // 3. Exit the process safely, successfully
            process.exit(0);  // exit status 0

        } catch (err: unknown) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
    })

    // Force exit if connections take too long to close (e.g., 10 seconds)
    setTimeout(() => {
        console.error('Forced shutdown due to timeout');
        process.exit(1);
    }, 10000)
}

// When Node receives SIGINT, call my shutdown() function.
process.on('SIGINT', () => shutdown('SIGINT')) // Ctrl+C

// Docker/Kubernetes or a hosting platform may send SIGTERM when stopping your application.
// SIGTERM is commonly used by process managers, containers, and hosting environments to tell your application: Please shut down.
// makes your application respond properly to those environments.
process.on('SIGTERM', () => shutdown('SIGTERM'))


/*
Shutdown begins
      │
      ├── server.close()
      │
      ├── db.end()
      │
      └── wait...
             │
             ├── completes within 10 sec → exit normally
             │
             └── takes > 10 sec → force exit

This is a good pattern for production applications.
*/

/*
                 START APPLICATION
                        │
                        ▼
                  app.listen()
                        │
                        ▼
                HTTP server running
                        │
                        │
             Application receives
             SIGINT or SIGTERM
                        │
                        ▼
               shutdown(signal)
                        │
                        ▼
             Stop new connections
                        │
                        ▼
           server.close() callback
                        │
                        ▼
              Close DB connection
                        │
                        ▼
                  process.exit(0)

This is a good architecture for your Express TypeScript backend.
*/

/*
For small or medium Express + TypeScript + PostgreSQL project:

src/
├── app.ts
├── server.ts          ← listen + graceful shutdown
├── config/
│   ├── db.ts
│   └── env.ts
├── controllers/
├── services/
├── repositories/
├── middleware/
└── routes/
*/

/*
app.ts configures Express, while server.ts is responsible for starting and stopping the application.
*/