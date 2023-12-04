import express from "express";
import connectDB from "./config/dbConnection";
import { createUser, loginUser } from "./controllers/auth.controller";
import initPassport from './controllers/authProviders/localAuth.controller'
require("dotenv").config();
import session from 'express-session';

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
app.post("/login", loginUser);
app.post("/register", createUser);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
