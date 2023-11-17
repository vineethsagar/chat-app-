import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Group from '../models/Group';
import Utils from '../middleware/Utils';
import Message from '../models/Message';
const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).populate(['owner', 'members', 'messages']);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;

        let userData;
        if (token) {
            userData = await Utils.getTokenData(token);
        }
        const { name } = req.body;
        const alreadyExists = await Group.findOne({ name });
        if (alreadyExists) {
            return res.status(403).json({ message: `Group with name ${name} already exists` });
        }
        const newGroup = new Group({ name, owner: userData, members: [userData] });
        await newGroup.save();
        res.status(201).json({ message: 'Group created successfully', data: newGroup });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const { name } = req.body;
        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (name) {
            group.name = name;
        } else {
            return res.status(400).json({ message: `Invalid name ${name}` });
        }
        await group.save();
        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const deletedGroup = await Group.findByIdAndRemove(groupId);
        // delete the messages as well
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const messages = await Message.deleteMany({ groupId });

        res.status(200).json({ message: 'Group deleted successfully', group: deletedGroup });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllGroups,
    getGroupById,
    createGroup,
    updateGroup,
    deleteGroup
};
