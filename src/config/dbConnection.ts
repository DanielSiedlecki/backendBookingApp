import mongoose from "mongoose";

function connectDB() {
    const url: string = process.env.databaseHOST || 'undefined';
    mongoose
        .connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB", err);
        });
}

export default connectDB;