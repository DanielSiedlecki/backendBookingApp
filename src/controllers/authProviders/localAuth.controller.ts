import passportLocal from "passport-local";
import passport from "passport";
import { Express } from "express";
import User from "../../schemats/userSchema";

const LocalStrategy = passportLocal.Strategy;

function initPassport(app: Express) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        new LocalStrategy({ usernameField: "email", passwordField: "password" }, async (username, password, done) => {
            try {

                const user = await User.authenticate()(username, password);

                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: "Incorrect password." });
                }
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {

        done(null, user);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}


export default initPassport;