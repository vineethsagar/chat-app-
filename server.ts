import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import userRoutes from './src/routes/Users';
import groupRoutes from './src/routes/Groups';
import messageRoutes from './src/routes/Messages';
import memberRoutes from './src/routes/Members';
import likeRoutes from './src/routes/Likes';
import { config } from './src/config/config';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import Users from './src/controllers/Users';
import Utils from './src/middleware/Utils';
const router = express();
// ! Swagger setup
const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chat App API',
            version: '1.0.0',
            description: 'A tiny NodeJS server for Chat App API'
        },
        servers: [
            {
                url: `http://localhost:${config.server.port}`
            }
        ]
    },
    apis: ['./src/routes/*.ts']
};

const specs = swaggerJSDoc(options);

// ! connect to mongodb
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        console.log('Connected to DB');
        startServer();
    })
    .catch((error) => {
        console.log('Failed to connect to DB : ');
        console.log(error);
    });

//! start server if mongodb connection is successfully

const startServer = () => {
    router.use((req, res, next) => {
        console.log(`Incoming connection -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            console.log(`Operation finished -> Method : [${req.method}] - Url : [${req.url}] - IP : [${req.socket.remoteAddress}] - Status : [${res.statusCode}]`);
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    // ! API rules
    router.use((req, res, next) => {
        //*  * -> req can come from anywhere or can keep ip's
        res.header('Access-Control-Allow-Origin', '*');

        //*  allowed headers
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        //* option that can be used in api
        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    // ! Routes

    router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
    router.use('/admin/user', Utils.authenticateToken, userRoutes);
    router.use('/login', Users.login);
    router.use('/logout', Users.logout);
    router.use('/groups', Utils.authenticateToken, groupRoutes);
    router.use('/groups/:groupId/members', Utils.authenticateToken, memberRoutes);
    router.use('/groups/:groupId/messages', Utils.authenticateToken, messageRoutes);
    router.use('/groups/:groupId/messages/:messageId/likes', Utils.authenticateToken, likeRoutes);
    // ! no route

    router.use((req, res, next) => {
        const error = new Error('Route not found');
        return res.status(404).json({ message: error.message });
    });

    // ! create server
    http.createServer(router).listen(config.server.port, () => {
        console.log(`Server is running on port ${config.server.port}.`);
    });
};
