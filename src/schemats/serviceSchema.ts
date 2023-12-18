import moongose, { Document } from "mongoose";

export interface serviceDocument extends Document {
    serviceName: string;
    serviceDuration: number;
    cost: number;
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
    cost: {
        type: Number,
        required: true
    }
});

const Service = moongose.model<serviceDocument>("Service", serviceSchema);

export default Service;
