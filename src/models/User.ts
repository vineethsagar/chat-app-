import mongoose, { Schema, Document } from 'mongoose';
export interface User {
    username: string;
    password: string;
    isAdmin: boolean;
}

export interface UserModel extends User, Document {}
const UserSchema: Schema = new Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true, select: false },
        isAdmin: { type: Boolean, required: true }
    },
    {
        versionKey: false,
        timestamps: true
    }
);
export default mongoose.model<UserModel>('User', UserSchema);
