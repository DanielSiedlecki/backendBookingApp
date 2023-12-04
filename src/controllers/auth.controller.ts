
import User from '.././schemats/userSchema'
import { Request, Response } from 'express';

async function createUser(req: Request, res: Response) {
    try {
        console.log(req.body)
        const { fullname, email, password } = req.body;

        const user = new User({ fullname, email })
        await User.register(user, password)

        res.status(201).json({ message: "User created succesfully" })

    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Error" })
    }

}

export default createUser;