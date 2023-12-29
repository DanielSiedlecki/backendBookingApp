import User from ".././schemats/userSchema";
import { Request, Response, NextFunction } from "express";
import { Token, tokenSchema } from "../schemats/tokenSchema";
import passport from "passport";
import crypto from "crypto"
import sendEmail from "../mailer/email";

async function createUser(req: Request, res: Response) {
  try {
    const existingUsers = await User.find();

    const { name, surname, email, password } = req.body;
    let role: string = "User";

    if (existingUsers.length === 0) {
      role = "Admin";
    }

    const existingUserWithEmail = await User.findOne({
      email
    })
    if (existingUserWithEmail) {
      return res.status(409).json({ message: "User with the given email is already registered" });
    }

    const user = new User({ name, surname, email, role });
    await User.register(user, password);

    res.status(201).json({ message: "User created succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error" });
  }
}

async function loginUser(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    { session: true },
    (err: Error, user: Object, info: string) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: "Authentication failed", info });
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }

        return res.status(200).json({ message: "Login successful", user });
      });
    }
  )(req, res, next);
}

async function forgotPasswordRequest(req: Request, res: Response) {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString('hex'),
      });

      const message = `${process.env.BASE_URL}/user/changepassword/${user.id}/${token.token}`;

      await sendEmail(user.email, 'Change Password', 'forgotPassword', { link: message });

      await token.save();

      res.status(200).json({ message: 'Email sent' });
    } else {
      res.status(400).json({ message: 'Email is not registered' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export { createUser, loginUser, forgotPasswordRequest };
