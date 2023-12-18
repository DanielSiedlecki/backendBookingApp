import User from ".././schemats/userSchema";
import { Request, Response, NextFunction } from "express";
import passport from "passport";

async function createUser(req: Request, res: Response) {
  try {
    const existingUsers = await User.find();

    const { name, surname, email, password } = req.body;
    let role: string = "User";

    if (existingUsers.length === 0) {
      role = "Admin";
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

export { createUser, loginUser };
