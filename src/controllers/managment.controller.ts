import { Request, Response, NextFunction } from "express";
import { openingHours, specialDays } from "../schemats/openingHouersSchema";

async function createWeek(req: Request, res: Response, next: NextFunction) {
    try {
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];

        const existingDays = await openingHours.find();
        if (existingDays.length < 7) {

            for (const d of days) {
                const day = new openingHours({
                    dayOfWeek: d,
                    openTime: "00:00",
                    closeTime: "00:00",
                }).save();
            }
        }
        return res.status(200).json({ message: "Created Days" });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

export { createWeek };
