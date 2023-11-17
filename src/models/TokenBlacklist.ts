import mongoose, { Schema, Document } from 'mongoose';
const tokenBlacklistSchema = new Schema({
    token: String
});

export default mongoose.model('TokenBlacklist', tokenBlacklistSchema);
