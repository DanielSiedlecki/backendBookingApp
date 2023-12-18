import mongoose, { Document, Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import { serviceDocument } from './serviceSchema';




interface UserDocument extends Document {
    fullname: string;
    email: string;
    password: string;
    role: string;
    position: string;
    services: mongoose.Types.ObjectId[] | serviceDocument[];
}

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        surname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: "User" },
        position: { type: String, required: false, default: "User" },
        services: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }]
    },
    { timestamps: { createdAt: true } }
);

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;