import mongoose, { Document, Schema, Types } from 'mongoose';

interface IToken extends Document {
    userId: Types.ObjectId;
    token: string;
}

const tokenSchema = new Schema<IToken>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

const Token = mongoose.model<IToken>('Token', tokenSchema);

export { Token, tokenSchema }