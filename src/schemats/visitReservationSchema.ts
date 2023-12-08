import mongoose, { Document } from "mongoose";

interface visitDocument extends Document {
    employee_id: string;
    dateVisit: string;
    startVisit: string;
    endVisit: string;
    serviceType: string;
    visitStatus: string;
    fullnameReserved: string;
    emailReserved: string;
    cost: number;
}

const visitSchema = new mongoose.Schema(
    {
        employee_id: { type: String, required: true },
        dateVisit: { type: String, required: true },
        startVisit: { type: String, required: true },
        endVisit: { type: String, required: true },
        serviceType: { type: String, required: true },
        visitStatus: { type: String, default: "Pending" },
        fullNameReserved: { type: String, required: true },
        emailReserved: { type: String, required: true },
        cost: { type: Number, required: true },
    },
    { timestamps: { createdAt: true } }
);

const visit = mongoose.model<visitDocument>("Visit", visitSchema);

export { visit };
