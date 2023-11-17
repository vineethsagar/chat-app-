import dotenv from 'dotenv';

dotenv.config();

const MONGO_USER_NAME = process.env.MONGO_USER_NAME || 'user';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'user';
const MONGO_URL = `mongodb+srv://vineethsagar:${MONGO_PASSWORD}@chat-app.tto5c9n.mongodb.net/?retryWrites=true&w=majority`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8080;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};
