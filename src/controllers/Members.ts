import { NextFunction, Request, Response } from 'express';
import Group from '../models/Group';

const getAllMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const members = await Group.findById(groupId, { members: 1 }).populate('members');
        console.log('members', groupId, req.originalUrl, req);
        res.status(200).json(members);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const putMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const { memberId } = req.body;
        const group = await Group.findById(groupId);
        if (group) {
            group.members.push(memberId);
        } else {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.save();
        res.status(200).json({ message: 'Member added to group successful!' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteMember = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { groupId } = req.params;
        const { memberId } = req.body;
        const group = await Group.findById(groupId);

        if (group) {
            group.members = group.members.filter((value) => value._id.toString() !== memberId);
        } else {
            return res.status(404).json({ message: 'Group not found' });
        }
        group.save();
        res.status(200).json({ message: 'Member deleted from the group successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export default {
    getAllMembers,
    putMember,
    deleteMember
};
