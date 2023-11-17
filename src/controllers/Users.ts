import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import TokenBlacklist from '../models/TokenBlacklist';
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password, isAdmin } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with that username.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, isAdmin });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update only the fields that are present in the request body
        if (req.body.username) {
            user.username = req.body.username;
        }

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            user.password = req.body.password;
        }

        if (req.body.isAdmin !== undefined) {
            user.isAdmin = req.body.isAdmin;
        }
        await user.save();
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findOneAndDelete({ _id: id });

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully', deletedUser });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username }).select(['password', 'username', 'isAdmin']);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin, _id: user._id }, 'test-secret', { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
const logout = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;
    token = token?.split(' ')[1];
    // Check if the token is already in the blacklist
    const isTokenBlacklisted = await TokenBlacklist.findOne({ token });

    if (isTokenBlacklisted?.token) {
        return res.status(401).json({ message: 'Token is invalid' });
    }

    // Add the token to the blacklist
    await TokenBlacklist.create({ token });
    res.status(200).json({ message: 'User logged out successfully. Token invalidated' });
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    logout
};
