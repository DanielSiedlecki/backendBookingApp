import { Request, Response, NextFunction } from "express";
import { openingHours } from "../schemats/openingHoursSchema";
import { specialDays } from "../schemats/specialDaysSchema";
import { getDayName, validDateFormat } from "../services/dataService";

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
                const day = await openingHours.create({
                    dayOfWeek: d,
                    openTime: "00:00",
                    closeTime: "00:00",
                });
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
        let result = await openingHours.find(
            {},
            { _id: 0, dayOfWeek: 1, openTime: 1, closeTime: 1 }
        );

        if (result.length > 0) {
            let days = result.map((entry) => ({
                dayName: entry.dayOfWeek,
                openTime: entry.openTime,
                closeTime: entry.closeTime,
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

        if (!validDateFormat(chooseDate)) {
            return res
                .status(400)
                .json({ message: 'Invalid date format. Please use "rrrr-mm-d".' });
        }

        const specDay = await specialDays.findOne({
            date: chooseDate,
        });

        if (specDay) {
            return res
                .status(200)
                .json({ openTime: specDay.openTime, closeTime: specDay.closeTime });
        } else if (!specDay) {
            const dayName = getDayName(new Date(chooseDate));

            const result = await openingHours.findOne({
                dayOfWeek: dayName,
            });
            if (result) {
                return res
                    .status(200)
                    .json({ openTime: result.openTime, closeTime: result.closeTime });
            }
        } else {
            return res.status(404).json({ message: "Wrong day" });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

async function createSpecialDay(req: Request, res: Response) {
    try {
        const { datDay, opTime, cloTime } = req.body;

        if (!validDateFormat(datDay)) {
            return res
                .status(400)
                .json({ message: 'Invalid date format. Please use "rrrr-mm-d".' });
        }

        let existingDay = await specialDays.findOne({
            date: datDay,
        });

        if (existingDay) {
            return res.status(400).json({ message: "The day already exists" });
        }

        const day = await specialDays.create({
            date: datDay,
            openTime: opTime,
            closeTime: cloTime,
        });

        res.status(201).json({ message: "Special day created successfully", day });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateSpecialDay(req: Request, res: Response) {
    try {
        const { datDay, opTime, cloTime } = req.body;

        if (!validDateFormat(datDay)) {
            return res
                .status(400)
                .json({ message: 'Invalid date format. Please use "rrrr-mm-d".' });
        }

        let day = await specialDays.findOneAndUpdate(
            { date: datDay },
            { $set: { openTime: opTime, closeTime: cloTime } },
            { new: true }
        );

        res.status(201).json({ message: "Special day updated successfully", day });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllSpecialDays(req: Request, res: Response) {
    try {
        let result = await specialDays.find(
            {},
            { _id: 0, dayOfWeek: 1, openTime: 1, closeTime: 1 }
        );

        if (result.length > 0) {
            let days = result.map((entry) => ({
                dayName: entry.date,
                openTime: entry.openTime,
                closeTime: entry.closeTime,
            }));

            return res.status(200).json({ days });
        } else {
            return res.status(404).json({ message: "No special days found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}
async function getSpecialDay(req: Request, res: Response) {

    try {
        const { chooseDate } = req.body;

        if (validDateFormat(chooseDate)) {
            let day = await specialDays.findOne({
                date: chooseDate
            })
            if (day) {
                return res.status(200).json({ day });
            }
            else {
                return res.status(404).json({ message: "Wrong date" });
            }
        }


    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}
async function removeSpecialDay(req: Request, res: Response) {

    try {
        const { chooseDate } = req.body;

        if (validDateFormat(chooseDate)) {
            let day = await specialDays.findOneAndDelete({
                date: chooseDate
            })
            if (day) {
                return res.status(200).json({ message: "Removed day:", day });
            }
            else {
                return res.status(404).json({ message: "Wrong date" });
            }
        }


    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

export {
    createWeek,
    changeOpenHouer,
    getAllOpenHours,
    getOpenHours,
    createSpecialDay,
    updateSpecialDay,
    getAllSpecialDays,
    getSpecialDay,
    removeSpecialDay
};
