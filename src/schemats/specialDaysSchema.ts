import mongoose, { Document } from "mongoose";


interface specialdaysSchemaDocument extends Document {
    date: Date;
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
}

const specialDaysSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    dayOfWeek: {
        type: String,
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

const specialDays = mongoose.model<specialdaysSchemaDocument>(
    "specialDays",
    specialDaysSchema
);

export { specialDays }
