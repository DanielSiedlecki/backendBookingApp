import mongoose, { Document } from "mongoose";
import { UserDocument } from "./userSchema";
interface eventDocument extends Document {
    employee: mongoose.Types.ObjectId[] | eventDocument[];
    eventStart: Date;
    eventEnd: Date;
    serviceType: string;
    eventStatus: string;
    fullnameReserved: string;
    emailReserved: string;
    cost: number;
    duration: number;
}

const eventSchema = new mongoose.Schema(
    {
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
        },
        eventStart: { type: Date, required: true },
        eventEnd: { type: Date, required: true },
        serviceType: { type: String, required: true },
        eventStatus: { type: String, default: "Pending" },
        fullNameReserved: { type: String, required: true },
        emailReserved: { type: String, required: true },
        cost: { type: Number, required: true },
        duration: { type: Number, required: true }
    },
    { timestamps: { createdAt: true } }
);

const event = mongoose.model<eventDocument>("Events", eventSchema);

export { event, eventDocument };
