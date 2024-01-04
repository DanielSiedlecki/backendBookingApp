import { NextFunction, Response, Request } from "express";
import session from "express-session";
const MongoStore = require('connect-mongo')

const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const dbUrl = process.env.databaseHOST

    return session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: dbUrl,
            collectionName: "session"
        })
    })(req, res, next);
};

export default sessionMiddleware;