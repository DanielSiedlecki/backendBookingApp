import passport from "passport";
import { Request } from "express";

passport.serializeUser((req: Request, user: any, done: any) => {
    done(null, user);
});


passport.deserializeUser((user: any, done: any) => {
    done(null, user);
});