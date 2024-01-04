import User, { UserDocument } from ".././schemats/userSchema";
import { Request, Response, NextFunction } from "express";
import { Token, tokenSchema } from "../schemats/tokenSchema";
import passport from "passport";
import crypto from "crypto";
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
      email,
    });
    if (existingUserWithEmail) {
      return res
        .status(409)
        .json({ message: "User with the given email is already registered" });
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
    (err: Error, user: UserDocument, info: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res
          .status(401)
          .json({ error: "Authentication failed", message: info.message });
      }

      req.logIn(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        if (req.isAuthenticated()) {
          return res.json({
            message: "Login successful",
            user,
            authorized: true,
          });
        } else {
          return res
            .status(403)
            .json({
              error: "Unauthorized",
              message: "User does not have the required permissions.",
            });
        }
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
        token: crypto.randomBytes(32).toString("hex"),
      });

      const message = `${process.env.BASE_URL}/user/changepassword/${user.id}/${token.token}`;

      await sendEmail(user.email, "Change Password", "forgotPassword", {
        link: message,
      });

      await token.save();

      res.status(200).json({ message: "Email sent" });
    } else {
      res.status(400).json({ message: "Email is not registered" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function logoutSession(req: Request, res: Response) {
  res.clearCookie("connect.sid");
  req.logout(function (err) {
    req.session.destroy(function (err) {
      res.send({ message: "Successed logout" });
      res.redirect("/");
    });
  });
}

async function changePasswordWithToken(req: Request, res: Response) {
  const { userId, token, newPassword } = req.body;

  try {
    const resetToken = await Token.findOne({ userId, token });

    if (!resetToken) {
      return res.status(400).json({ error: "Invalid token" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.setPassword(newPassword, async () => {
      await user.save();

      await resetToken.remove();

      return res.status(200).json({ message: "Password changed successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export {
  createUser,
  loginUser,
  forgotPasswordRequest,
  changePasswordWithToken,
  logoutSession,
};
