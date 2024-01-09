import {
    specialDays,
    SpecialDaysSchemaDocument,
} from "../schemats/specialDaysSchema";
import { openingHours } from "../schemats/openingHoursSchema";
import { Request, Response } from "express";
import { event, eventDocument } from "../schemats/eventSchema";
import { getDayName } from "../services/dataService";
import sendEmail from "../mailer/email";
import moment from "moment-timezone";
import User from "../schemats/userSchema";
import convertTimeStringToTimestampUTC from "../services/convertTimeToTimestampUTC";

async function getAllEvents(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.params.userid;

        const findEvents = await event.find({ employee: userId });
        if (!findEvents || findEvents.length === 0) {
            res
                .status(404)
                .json({ message: "No events found for the given user id" });
        } else {
            res.status(200).json({ events: findEvents });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function getEvent(req: Request, res: Response) {
    try {
        const eventId = req.params.id;

        const findEvent = await event.findById(eventId);

        if (findEvent) {
            console.log(findEvent);
            res.status(202).json({ findEvent });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error from server" });
    }
}

async function createEvent(req: Request, res: Response) {
    try {
        const {
            employee_id,
            eventStart,
            serviceType,
            fullNameReserved,
            emailReserved,
            cost,
            duration,
        } = req.body;
        console.log;
        const employee = await User.findById(employee_id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const eventStartDateTime = new Date(eventStart);
        const eventEndDateTime = new Date(
            eventStartDateTime.getTime() + duration * 60000
        );
        const eventStartUTC = eventStartDateTime.toLocaleString("en-US", {
            timeZone: "UTC",
        });
        const eventEndUTC = eventEndDateTime.toLocaleString("en-US", {
            timeZone: "UTC",
        });

        const newEvent: eventDocument = new event({
            employee,
            eventStart: eventStartDateTime.toISOString(),
            eventEnd: eventEndDateTime.toISOString(),
            serviceType,
            fullNameReserved,
            emailReserved,
            cost,
            duration,
        });

        await newEvent.save();
        await sendEmail(
            emailReserved,
            "Potwierdzenie wizyty",
            "eventConfirmation",
            { link: `http://localhost:5173/events/cancelEvent/${newEvent.id}` }
        );

        res
            .status(201)
            .json({ message: "Event successfully created", event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error from server" });
    }
}

async function cancelEvent(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        const findEvent = await event.findByIdAndUpdate(
            eventId,
            { eventStatus: "Canceled" },
            { new: true }
        );
        console.log(findEvent);
        if (findEvent) {
            await sendEmail(
                findEvent.emailReserved,
                "Termin odwołany",
                "cancelEventConfirmation",
                {}
            );
            res.status(200).json({ message: "Event canceled" });
        } else {
            res.status(404).json({ message: "Event not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function getAvailableHours(req: Request, res: Response) {
    try {
        const dateParam = req.query.date;
        const employeeID = req.query.employeeID;
        const date = moment(dateParam?.toString()).toDate();
        const dayOfWeek = getDayName(date);
        const specialDay = await specialDays.findOne({ date });

        let openTime: string;
        let closeTime: string;

        if (typeof employeeID !== "string") {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        if (specialDay) {
            openTime = specialDay.openTime;
            closeTime = specialDay.closeTime;
        } else {
            const normalDay = await openingHours.findOne({ dayOfWeek });
            if (normalDay) {
                openTime = normalDay.openTime;
                closeTime = normalDay.closeTime;
            } else {
                return res.status(404).json({
                    message: "No opening hours information available for this day.",
                });
            }
        }

        const availableHours: string[] = [];
        let currentTime = new Date(convertTimeStringToTimestampUTC(openTime));
        const closingTime = new Date(convertTimeStringToTimestampUTC(closeTime));

        while (currentTime < closingTime) {
            const eventStart = currentTime;
            const eventEnd = new Date(currentTime.getTime() + 30 * 60000);
            const formattedTime = `${currentTime
                .getUTCHours()
                .toString()
                .padStart(2, "0")}:${currentTime
                    .getUTCMinutes()
                    .toString()
                    .padStart(2, "0")}`;

            const eventExists = await event.findOne({
                employee: employeeID,
                eventStart: { $lt: eventEnd },
                eventEnd: { $gt: eventStart },
            });

            const isNotFinishedOrCancelled =
                eventExists &&
                eventExists.eventStatus !== "Ended" &&
                eventExists.eventStatus !== "Canceled";

            if (!eventExists || !isNotFinishedOrCancelled) {
                availableHours.push(formattedTime);
            }

            currentTime.setUTCMinutes(currentTime.getUTCMinutes() + 30);
        }

        res.json({ availableHours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function updateEventDate(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        const { newEventStart } = req.body;
        console.log(req.body);

        const eventToUpdate = await event.findById(eventId);

        if (!eventToUpdate) {
            return res.status(404).json({ message: "Event not found" });
        }
        const emailReserved = eventToUpdate.emailReserved;
        const eventStartDateTime = new Date(newEventStart);
        const eventEndDateTime = new Date(
            eventStartDateTime.getTime() + eventToUpdate.duration * 60000
        );

        eventToUpdate.eventStart = eventStartDateTime;
        eventToUpdate.eventEnd = eventEndDateTime;
        await eventToUpdate.save();
        console.log("Event date updated successfully", eventToUpdate);
        res.status(200).json({
            message: "Event date updated successfully",
            event: eventToUpdate,
        });
        await sendEmail(
            emailReserved,
            "Zmiana terminu",
            "changeEventConfirmation",
            { link: `http://localhost:5173/events/cancelEvent/${eventToUpdate.id}` }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

async function endedEvent(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        console.log(req.body);

        const eventToUpdate = await event.findByIdAndUpdate(
            eventId,
            { eventStatus: "Ended" },
            { new: true }
        );

        if (!eventToUpdate) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event ended" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export {
    createEvent,
    getAvailableHours,
    getEvent,
    cancelEvent,
    updateEventDate,
    getAllEvents,
    endedEvent,
};
