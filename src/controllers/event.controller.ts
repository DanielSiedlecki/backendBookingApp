import {
    specialDays,
    SpecialDaysSchemaDocument,
} from "../schemats/specialDaysSchema";
import { openingHours } from "../schemats/openingHoursSchema";
import { Request, Response } from "express";
import { event, eventDocument } from "../schemats/eventSchema";
import { getDayName } from "../services/dataService";
import sendEmail from "../mailer/email";
import moment from "moment";

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
        console.log(req.body);

        const eventStartDateTime = new Date(eventStart);
        const eventEndDateTime = new Date(eventStartDateTime);
        eventEndDateTime.setMinutes(eventStartDateTime.getMinutes() + duration);
        console.log(eventEndDateTime);
        const newEvent: eventDocument = new event({
            employee_id,
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
            .json({ message: "Evente succesfull created", event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error from server" });
    }
}

async function cancelEvent(req: Request, res: Response) {
    try {
        const eventId = req.params.id;
        const findEvent = await event.findByIdAndDelete(eventId);
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
        const date = moment.utc(dateParam?.toString()).toDate();
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
            console.log(normalDay);
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

        while (currentTime < closingTime) {
            const appointmentEndTime = new Date(currentTime);
            appointmentEndTime.setMinutes(appointmentEndTime.getMinutes() + 30);

            if (appointmentEndTime <= closingTime) {
                const hours = currentTime.getHours().toString().padStart(2, "0");
                const minutes = currentTime.getMinutes().toString().padStart(2, "0");
                const formattedTime = `${hours}:${minutes}`;
                const eventStart = moment(currentTime).toDate()
                const eventEnd = moment(currentTime).add(30, "minutes").toDate()

                const eventExists = await event.findOne({
                    employee_id: employeeID,
                    eventStart: { $lt: eventEnd },
                    eventEnd: { $gt: eventStart },
                });

                if (!eventExists) {
                    availableHours.push(formattedTime);
                }
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
        console.log(req.body)

        const eventToUpdate = await event.findById(eventId);

        if (!eventToUpdate) {
            return res.status(404).json({ message: "Event not found" });
        }
        const emailReserved = eventToUpdate.emailReserved;
        const eventStartDateTime = new Date(newEventStart);
        const eventEndDateTime = new Date(eventStartDateTime);
        eventEndDateTime.setMinutes(eventStartDateTime.getMinutes() + eventToUpdate.duration);

        eventToUpdate.eventStart = eventStartDateTime;
        eventToUpdate.eventEnd = eventEndDateTime;
        await eventToUpdate.save();
        console.log("Event date updated successfully", eventToUpdate)
        res.status(200).json({ message: "Event date updated successfully", event: eventToUpdate });
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

export { createEvent, getAvailableHours, getEvent, cancelEvent, updateEventDate };
