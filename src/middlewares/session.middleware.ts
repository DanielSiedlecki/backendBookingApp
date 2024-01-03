import { NextFunction, Response, Request } from "express";
import session from "express-session";
const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {


    return session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }
    })(req, res, next);
};


export default sessionMiddleware;
