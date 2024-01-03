import passportLocal from 'passport-local';
import passport from 'passport';
import { Express } from 'express';
import User from '../schemats/userSchema';

const LocalStrategy = passportLocal.Strategy;

function initPassport(app: Express) {
    passport.serializeUser((user: any, done) => {
        console.log(user._id);
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            console.log(id);
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });

    passport.use(
        new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
            try {
                const localuser = await User.authenticate()(email, password);
                if (!localuser.user) {
                    return done(null, false, { message: 'Incorrect email or password' });
                }

                console.log('User Found');
                return done(null, localuser.user);
            } catch (err) {
                console.error(err);
                return done(err);
            }
        })
    );
}

export default initPassport;