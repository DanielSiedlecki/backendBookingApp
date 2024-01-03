import express from "express";
import connectDB from "./config/dbConnection";
import { createUser, loginUser } from "./controllers/auth.controller";
import routerAuth from "./routes/auth.routes";
import routerManagment from "./routes/managment.routes";
import routerServices from "./routes/services.routes"
import routerHairdressers from "./routes/hairdressers.routes"
import routerEvents from "./routes/event.routes"
require("dotenv").config();
import sessionMiddleware from "./middlewares/session.middleware";
import initPassport from "./middlewares/passport.middleware";
import cors from 'cors';

connectDB();
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173'
};
app.use(cors(corsOptions));
app.use(sessionMiddleware);
const port = process.env.PORT || 3030;
app.use(express.json());

initPassport(app);
app.use("/managment", routerManagment);
app.use("/auth", routerAuth);
app.use("/services", routerServices)
app.use("/hairdresser", routerHairdressers)
app.use("/events", routerEvents)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
