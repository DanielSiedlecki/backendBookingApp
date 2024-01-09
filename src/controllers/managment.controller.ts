import { Request, Response, NextFunction } from "express";
import { openingHours } from "../schemats/openingHoursSchema";
import { specialDays } from "../schemats/specialDaysSchema";
import { getDayName, isUTCDate } from "../services/dataService";
import { validFormatTime } from "../services/timeService";
import parseTime from "../services/parseTimeString";
import moment from "moment";

async function createWeek(req: Request, res: Response, next: NextFunction) {
    try {
        const daysOfWeek = [
            "Poniedziałek",
            "Wtorek",
            "Środa",
            "Czwartek",
            "Piątek",
            "Sobota",
            "Niedziela",
        ];

        const existingDaysCount = await openingHours.countDocuments();

        if (existingDaysCount < 7) {
            await openingHours.deleteMany();

            const createdDays = [];

            for (const dayOfWeek of daysOfWeek) {
                const day = await openingHours.create({
                    dayOfWeek,
                    openTime: "00:00",
                    closeTime: "00:00",
                });
                createdDays.push(day);
            }

            return res.status(200).json({ message: "Created Days", createdDays });
        }

        return res
            .status(404)
            .json({ message: "Error: Too many days already exist" });
    } catch (error) {
        console.error(error);
        return res.status(502).json({ message: "Internal Server Error" });
    }
}

async function changeOpenHour(req: Request, res: Response) {
    try {
        const { dayName, startTime, endTime } = req.body;
        console.log(req.body);

        if (!validFormatTime(startTime) || !validFormatTime(endTime)) {
            return res.status(400).json({ message: "Wrong format" });
        }

        const startTimeObj = parseTime(startTime);
        const endTimeObj = parseTime(endTime);

        if (startTimeObj > endTimeObj) {
            return res
                .status(401)
                .json({ message: "Opening time cannot be greater than closing time" });
        }

        const result = await openingHours.findOneAndUpdate(
            { dayOfWeek: dayName },
            { $set: { openTime: startTime, closeTime: endTime } },
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
            let days = result.map((entry: any) => ({
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

        if (!isUTCDate(chooseDate)) {
            return res.status(404).json({ message: "Wrong format" });
        }

        const specDay = await specialDays.findOne({
            date: chooseDate,
        });

        if (specDay) {
            return res
                .status(200)
                .json({ openTime: specDay.openTime, closeTime: specDay.closeTime });
        } else if (!specDay) {
            const dayName = getDayName(chooseDate);

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
        const dateDay = new Date(datDay);

        if (isUTCDate(dateDay)) {
            return res.status(400).json({ message: "Wrong format" });
        }

        let date = moment.utc(datDay);
        date = date.startOf("day");

        const openTime = opTime;
        const closeTime = cloTime;

        const existingDay = await specialDays.findOne({
            date: { $eq: date.toDate() },
        });

        if (existingDay) {
            return res.status(400).json({ message: "The day already exists" });
        }

        const day = await specialDays.create({
            date,
            openTime,
            closeTime,
        });

        res.status(201).json({ message: "Special day created successfully", day });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateSpecialDay(req: Request, res: Response) {
    try {
        const { chooseDate, opTime, cloTime } = req.body;
        if (!isUTCDate(chooseDate)) {
            return res.status(404).json({ message: "Wrong format" });
        }

        if (!validFormatTime(opTime) || !validFormatTime(cloTime)) {
            return res.status(400).json({ message: "Wrong format" });
        }

        const day = await specialDays.findOneAndUpdate(
            { date: { $lte: new Date(chooseDate) } },
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
            let days = result.map((entry: any) => ({
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
        if (!isUTCDate(chooseDate)) {
            return res.status(404).json({ message: "Wrong format" });
        }

        const dateToCheck = moment.utc(chooseDate).startOf("day").toDate();
        const day = await specialDays.findOne({ date: { $eq: dateToCheck } });

        if (day) {
            return res.status(200).json({ day });
        } else {
            return res.status(404).json({ message: "Day not found" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
async function removeSpecialDay(req: Request, res: Response) {
    try {
        const { chooseDate } = req.body;

        if (!isUTCDate(chooseDate)) {
            return res.status(404).json({ message: "Wrong format" });
        }

        let day = await specialDays.findOneAndDelete({
            date: { $lte: new Date(chooseDate) },
        });
        if (day) {
            return res.status(200).json({ message: "Removed day:", day });
        } else {
            return res.status(404).json({ message: "Wrong date" });
        }
    } catch (err) {
        console.log(err);
        return res.status(502).json({ message: "Error" });
    }
}

export {
    createWeek,
    changeOpenHour,
    getAllOpenHours,
    getOpenHours,
    createSpecialDay,
    updateSpecialDay,
    getAllSpecialDays,
    getSpecialDay,
    removeSpecialDay,
};
