import express from "express";
import connectDB from "./config/dbConnection";
import { createUser, loginUser } from "./controllers/auth.controller";
import routerAuth from "./routes/auth.routes";
import routerManagment from "./routes/managment.routes";
require("dotenv").config();
import session from "express-session";
import initPassport from "./controllers/authProviders/localAuth.controller";
import cors from 'cors';

connectDB();
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173'
};
app.use(cors(corsOptions));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  }),
);
const port = process.env.PORT || 3030;
app.use(express.json());

initPassport(app);
app.use("/managment", routerManagment);
app.use("/auth", routerAuth);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
