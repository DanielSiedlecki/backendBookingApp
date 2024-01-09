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

        const eventStartDateTime = moment.utc(eventStart).toDate();
        const eventEndDateTime = moment
            .utc(eventStartDateTime)
            .add(duration, "minutes")
            .toDate();

        const newEvent: eventDocument = new event({
            employee,
            eventStart: eventStartDateTime,
            eventEnd: eventEndDateTime,
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
        const specialDay: SpecialDaysSchemaDocument | null =
            await specialDays.findOne({ date: date });

        let openTime: string;
        let closeTime: string;
        if (typeof employeeID !== "string") {
            return res.status(400).json({ message: "Invalid employee ID" });
        }
        if (specialDay) {
            openTime = specialDay.openTime;
            closeTime = specialDay.closeTime;
        } else {
            const normalDay = await openingHours.findOne({ dayOfWeek: dayOfWeek });
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
        let currentTime = new Date(date);

        currentTime.setHours(
            parseInt(openTime.split(":")[0]),
            parseInt(openTime.split(":")[1])
        );

        const closingTime = new Date(date);
        closingTime.setHours(
            parseInt(closeTime.split(":")[0]),
            parseInt(closeTime.split(":")[1])
        );
        closingTime.setHours(closingTime.getHours() + 1);
        currentTime.setHours(currentTime.getHours() + 1);

        while (currentTime < closingTime) {
            const hours = currentTime.getHours().toString().padStart(2, "0");
            const minutes = currentTime.getMinutes().toString().padStart(2, "0");
            const formattedTime = moment(currentTime)
                .subtract(1, "hour")
                .format("HH:mm");
            const eventStart = moment(currentTime).toDate();
            const eventEnd = moment(currentTime).add(30, "minutes").toDate();
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

            currentTime.setMinutes(currentTime.getMinutes() + 30);
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
        const eventEndDateTime = new Date(eventStartDateTime);
        eventEndDateTime.setMinutes(
            eventStartDateTime.getMinutes() + eventToUpdate.duration
        );

        eventStartDateTime.setHours(eventStartDateTime.getHours() + 1);
        eventEndDateTime.setHours(eventEndDateTime.getHours() + 1);

        eventToUpdate.eventStart = eventStartDateTime;
        eventToUpdate.eventEnd = eventEndDateTime;
        await eventToUpdate.save();
        console.log("Event date updated successfully", eventToUpdate);
        res
            .status(200)
            .json({
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
