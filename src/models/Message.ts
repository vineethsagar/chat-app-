import mongoose, { Schema, Document } from 'mongoose';
import { UserModel } from './User';
export interface Message {
    message: string;
    author: UserModel;
    likes: Array<UserModel>;
    groupId: string;
}

export interface MessageModel extends Message, Document {}
const MessageSchema: Schema = new Schema(
    {
        message: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        groupId: { type: Schema.Types.ObjectId, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
export default mongoose.model<MessageModel>('Message', MessageSchema);
