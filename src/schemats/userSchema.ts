import mongoose, { Document, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

interface UserDocument extends Document {
    fullname: string;
    email: string;
    password: string;
    role: string;
    position: string;
    services: Array<string>
}

const userSchema = new Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: "User" },
        position: { type: String, required: false, default: "User" },
        services: { type: Array<String>, required: false }
    },
    { timestamps: { createdAt: true } }
);

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;