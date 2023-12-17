import User from "../schemats/userSchema";
import Service from "../schemats/serviceSchema";
import mongoose from "mongoose";
import { Response, Request } from "express";

async function setHairdresserRoleToUser(req: Request, res: Response) {
    try {
        const userId = req.params.id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role: "Hairdresser" },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res
            .status(200)
            .json({ message: "User role updated to Hairdresser", user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: "Error updating user role" });
    }
}
async function setServiceToUser(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        const { serviceIds } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "Hairdresser") {
            return res.status(403).json({ message: "User is not a Hairdresser" });
        }

        for (const serviceId of serviceIds) {
            const serviceExists = await Service.exists({ _id: serviceId });
            if (!serviceExists) {
                return res
                    .status(404)
                    .json({ message: `Service with ID ${serviceId} not found` });
            }
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { services: { $each: serviceIds } } },
            { new: true }
        ).populate("services");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res
            .status(200)
            .json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: "Error updating user" });
    }
}

async function getHairdressers(req: Request, res: Response) {
    try {
        const hairdressers = await User.find({ role: "Hairdresser" }).populate(
            "services"
        );
        return res.status(200).json(hairdressers);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching users" });
    }
}

export { setHairdresserRoleToUser, setServiceToUser, getHairdressers };
