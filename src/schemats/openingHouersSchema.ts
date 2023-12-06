import mongoose, { Document } from "mongoose";

interface openningHoursSchemaDocument extends Document {
    dayOfWeek: string;
    openTime: string;
    closeTime: string;
}

interface specialdaysSchemaDocument extends Document {
    date: Date;
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
const openingHours = mongoose.model<openningHoursSchemaDocument>(
    "openningHours",
    openingHoursSchema
);
const specialDays = mongoose.model<specialdaysSchemaDocument>(
    "specialDays",
    specialDaysSchema
);

export { openingHours, specialDays };
