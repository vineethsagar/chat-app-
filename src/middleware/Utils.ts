import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import TokenBlacklist from '../models/TokenBlacklist';
const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided' });
    }
    token = token.split(' ')[1];
    const isTokenBlacklisted = await TokenBlacklist.findOne({ token });

    if (isTokenBlacklisted) {
        return res.status(401).json({ message: 'Token is invalid. Please login again' });
    }
    jwt.verify(token, 'test-secret', (err: any, payload: any) => {
        if (err) {
            return res.status(403).json({ message: err.message });
        }
        if (req.originalUrl.includes('admin') && !payload.isAdmin) {
            return res.status(401).json({ message: 'Insufficient access permissions' });
        }
        next();
    });
};

const getTokenData = (token: string) => {
    token = token.split(' ')[1];
    let data;
    return new Promise((res, rej) => {
        try {
            jwt.verify(token, 'test-secret', (err: any, payload: any) => {
                if (err) {
                    rej(err);
                }
                data = payload;
                res(payload);
            });
        } catch (error) {
            rej(error);
        }
    });
};
export default {
    authenticateToken,
    getTokenData
};
