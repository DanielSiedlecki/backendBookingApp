import * as express from "express";
import * as managmentController from "../controllers/managment.controller";

const router = express.Router();

router.get("/createWeek", managmentController.createWeek);

router.get("/getOpenHours", managmentController.getOpenHours);
router.get("/getAllOpenHours", managmentController.getAllOpenHours);
router.put("/updateOpenHour", managmentController.changeOpenHour);

router.get("/getSpecialDay", managmentController.getSpecialDay);
router.get("/getAllSpecialDays", managmentController.getAllSpecialDays);
router.post("/createSpecialDay", managmentController.createSpecialDay);
router.delete("/removeSpecialDay", managmentController.removeSpecialDay);

router.get("/getAllUsers", managmentController.getAllUsers);
router.delete("/deleteUser/:id", managmentController.deleteUser);
router.put("/updateRoleUser/:id", managmentController.updateRoleUser);

export default router;
