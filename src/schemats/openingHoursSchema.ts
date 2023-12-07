import mongoose, { Document } from "mongoose";

interface openningHoursSchemaDocument extends Document {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
}

const openingHoursSchema = new mongoose.Schema({
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


const openingHours = mongoose.model<openningHoursSchemaDocument>(
    "openningHours",
    openingHoursSchema
);

export { openingHours };
