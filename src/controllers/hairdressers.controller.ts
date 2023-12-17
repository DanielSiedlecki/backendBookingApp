import User from '../schemats/userSchema'
import Service from '../schemats/serviceSchema'
import mongoose from 'mongoose'
import { Response, Request } from "express";

async function setHairdresserRoleToUser(req: Request, res: Response) {
    try {
        const userId = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(userId, { role: 'Hairdresser' }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "User role updated to Hairdresser", user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: "Error updating user role" });
    }
}
