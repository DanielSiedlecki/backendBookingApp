import moongose, { Document } from "mongoose";

interface serviceDocument extends Document {
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

const Service = moongose.model<serviceDocument>("service", serviceSchema);

export default Service;
