import moongose, { Document } from "mongoose";

interface serviceDocument extends Document {
    serviceName: string;
    serviceDuration: number;
}

const serviceSchema = new moongose.Schema({
    serviceName: {
        type: String,
        required: true,
    },
    serviceDuration: {
        type: Number,
        required: true,
    },
});

const service = moongose.model<serviceDocument>("service", serviceSchema);

export { service };