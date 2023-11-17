import mongoose, { Schema, Document } from 'mongoose';
import { MessageModel } from './Message';
import { UserModel } from './User';
export interface Group {
    messages: Array<MessageModel>;
    members: Array<UserModel>;
    name: string;
    owner: UserModel;
}

export interface GroupModel extends Group, Document {}
const GroupSchema: Schema = new Schema(
    {
        messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        name: { type: String, required: true },
        owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
export default mongoose.model<GroupModel>('Group', GroupSchema);
