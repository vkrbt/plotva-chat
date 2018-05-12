const {createServer} = require('./src/server/server');

const {
    MONGO_USER,
    MONGO_PASSWORD,
    MONGO_LOCAL = 'false',
    MONGO_DATABASE,
    MONGO_HOST,
    MONGO_PORT,
    SERVER_HOST = 'localhost',
    PORT = 3001
} = process.env;

/**
 * Setup mongo configuration
 */
const DATABASE_CONFIG = {
    user: MONGO_USER,
    password: MONGO_PASSWORD,
    host: MONGO_HOST,
    port: MONGO_PORT,
    local: MONGO_LOCAL !== 'false',
    database: MONGO_DATABASE
};

/**
 * Socket.io server
 */
const SERVER_CONFIG = {
    host: SERVER_HOST,
    port: PORT,
};

createServer(SERVER_CONFIG, DATABASE_CONFIG)
    .catch(err => {
        console.log(err);
    });
