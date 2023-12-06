import * as express from 'express';
import * as managmentController from '../controllers/managment.controller'

const router = express.Router();

router.get("/createWeek", managmentController.createWeek)




export default router