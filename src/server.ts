import express from "express";
import connectDB from "./config/dbConnection";
import { createUser, loginUser } from "./controllers/auth.controller";
import routerAuth from "./routes/auth.routes"
require("dotenv").config();
import session from 'express-session';
import initPassport from "./controllers/authProviders/localAuth.controller";

connectDB();
const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,

}));
const port = process.env.PORT || 3030;
app.use(express.json());

initPassport(app);
app.use("/auth", routerAuth)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
