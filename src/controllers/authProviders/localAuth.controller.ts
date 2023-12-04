import * as passportStrategy from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";
import { Express, Request, Response, NextFunction } from "express";
import User from "../../schemats/userSchema"

function initPassport(app: Express) {

    const user = new User();
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));


    passport.use(new passportStrategy.Strategy(
        { usernameField: "email" }, async (email, password, done) => {
            try {
                if (!email) { done(null, false) }
                const searchUser = user.findUser(email);
                if (searchUser.email == email && await bcrypt.compare(password, (searchUser.password).toString())) {
                    done(null, searchUser.users[0]);
                } else {
                    done(null, false);
                }
            } catch (e) {
                done(e);
            }
        }));


}