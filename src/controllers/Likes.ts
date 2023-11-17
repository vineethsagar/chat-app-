import { UserModel } from './../models/User';
import { NextFunction, Request, Response } from 'express';
import Message from '../models/Message';
import Utils from '../middleware/Utils';
import User from '../models/User';

const getAllLikes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId).populate('likes');
        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Operation Successful!', data: message.likes });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const postLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { messageId } = req.params;
        const token = req.headers.authorization;
        let userData;
        if (token) {
            userData = await Utils.getTokenData(token);
        }
        const msg = await Message.findById(messageId);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }
        msg.likes.push(userData as UserModel);
        await msg.save();
        res.status(200).json({ message: 'Operation Successful!', data: msg });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { messageId } = req.params;
        const token = req.headers.authorization;
        let userData: any;
        if (token) {
            userData = await Utils.getTokenData(token);
        }
        const msg = await Message.findById(messageId);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }
        msg.likes = msg.likes.filter((value) => value._id.toString() !== userData._id);
        await msg.save();
        res.status(200).json({ message: 'Operation Successful!', data: msg });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllLikes,
    postLike,
    deleteLike
};
