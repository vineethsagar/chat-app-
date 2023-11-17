import { NextFunction, Request, Response } from 'express';
import Message from '../models/Message';
import Group from '../models/Group';
import Utils from '../middleware/Utils';

const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate('messages');
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Operation Successful!', data: group.messages });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const postMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const { message } = req.body;

        const token = req.headers.authorization;

        let userData;
        if (token) {
            userData = await Utils.getTokenData(token);
        }
        const newMessage = new Message({ message, author: userData, likes: [], groupId: groupId });

        await newMessage.save();
        console.log('new message Id', newMessage.id);

        const group = await Group.findById(groupId);
        if (group) {
            group.messages.push(newMessage.id);
            await group.save();
        } else {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.status(200).json({ message: 'Operation Successful!', data: newMessage });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { messageId } = req.params;
        const msg = await Message.findByIdAndDelete(messageId);
        if (!msg) {
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Operation Successful!' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllMessages,
    postMessage,
    deleteMessage
};
