import * as express from 'express';
import * as managmentController from '../controllers/managment.controller'

const router = express.Router();

router.get("/createWeek", managmentController.createWeek)
router.put("/changeHouer", managmentController.changeOpenHouer)




export default router