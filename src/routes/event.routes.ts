import express from "express";
import * as eventController from "../controllers/event.controller";
const router = express.Router();

router.post("/createEvent", eventController.createEvent);
router.get("/getAvailableHours", eventController.getAvailableHours);
router.get("/getEvent/:id", eventController.getEvent);
router.get("/getAllEvents/:userid", eventController.getAllEvents);
router.delete("/cancelEvent/:id", eventController.cancelEvent);
router.put("/updateEvent/:id", eventController.updateEventDate);
router.put("/endedEvent/:id", eventController.endedEvent)

export default router;
