require("dotenv").config();

const http = require("http");
const app = require("./app");
const ConnectToDb = require("./db/db");
const { initializeSocket } = require("./socket");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

async function startServer() {
    try {
        await ConnectToDb();

        initializeSocket(server);

        server.listen(PORT, () => {
            console.log(`GATI server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start GATI:", error.message);
        process.exit(1);
    }
}

startServer();