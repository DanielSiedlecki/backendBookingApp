import mongoose, { Schema } from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema(
    {
        fullname: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, required: true, default: "User" },
    },
    { timestamps: { createdAt: true } }
);

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

const User = mongoose.model('User', userSchema);

export default User;