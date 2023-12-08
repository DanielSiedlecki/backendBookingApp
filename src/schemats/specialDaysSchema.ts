import mongoose, { Document } from "mongoose";

interface SpecialDaysSchemaDocument extends Document {
    date: Date;
    openTime: string;
    closeTime: string;
}

const specialDaysSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    openTime: {
        type: String,
        required: true,
    },
    closeTime: {
        type: String,
        required: true,
    },
});

const specialDays = mongoose.model<SpecialDaysSchemaDocument>(
    "SpecialDays",
    specialDaysSchema
);

export { specialDays };