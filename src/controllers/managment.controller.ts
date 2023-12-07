import { Request, Response, NextFunction } from "express";
import { openingHours, specialDays } from "../schemats/openingHouersSchema";
import { getDayName } from "../services/dataService";

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
            await openingHours.deleteMany();

            for (const d of days) {
                const day = new openingHours({
                    dayOfWeek: d,
                    openTime: "00:00",
                    closeTime: "00:00",
                }).save();
            }
            return res.status(200).json({ message: "Created Days" });
        }
        return res.status(404).json({ message: "Error to many days" });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

async function changeOpenHouer(req: Request, res: Response) {
    try {
        const { dayName, opTime, clTime } = req.body;
        const result = await openingHours.findOneAndUpdate(
            { dayOfWeek: dayName },
            { $set: { openTime: opTime, closeTime: clTime } },
            { new: true }
        );

        if (result) {
            console.log(result);
            return res
                .status(200)
                .json({ message: "Update hours", updatedData: result });
        } else {
            return res
                .status(404)
                .json({ message: "No document found for the specified dayName" });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

async function getAllOpenHours(req: Request, res: Response) {
    try {
        let result = await openingHours.find({}, { _id: 0, dayOfWeek: 1, openTime: 1, closeTime: 1 });

        if (result.length > 0) {
            let days = result.map(entry => ({
                dayName: entry.dayOfWeek,
                openTime: entry.openTime,
                closeTime: entry.closeTime
            }));

            return res.status(200).json({ days });
        } else {
            return res.status(404).json({ message: "No opening hours found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

async function getOpenHours(req: Request, res: Response) {
    try {
        const { chooseDate } = req.body;

        const dayName = getDayName(new Date(chooseDate));

        const result = await openingHours.findOne({
            dayOfWeek: dayName,
        });

        if (result) {
            return res
                .status(200)
                .json({ openTime: result.openTime, closeTime: result.closeTime });
        }

        return res.status(404).json({ message: "Wrong day" });
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}
export { createWeek, changeOpenHouer, getAllOpenHours, getOpenHours };
