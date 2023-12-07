import * as express from 'express';
import * as managmentController from '../controllers/managment.controller'

const router = express.Router();

router.get("/createWeek", managmentController.createWeek)
router.put("/changeHouer", managmentController.changeOpenHouer)

router.get("/getOpenHours", managmentController.getOpenHours)
router.get("/getAllOpenHours", managmentController.getAllOpenHours)


export default router