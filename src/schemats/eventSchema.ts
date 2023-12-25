import mongoose, { Document } from "mongoose";

interface eventDocument extends Document {
    employee_id: string;
    eventStart: Date;
    eventEnd: Date;
    serviceType: string;
    visitStatus: string;
    fullnameReserved: string;
    emailReserved: string;
    cost: number;
    duration: number;
}

const eventSchema = new mongoose.Schema(
    {
        employee_id: { type: String, required: true },
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
