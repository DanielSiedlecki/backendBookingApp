import express from 'express';
import * as eventController from '../controllers/event.controller'
const router = express.Router();


router.post('/createEvent', eventController.createEvent);
router.get('/getAvailableHours', eventController.getAvailableHours)

export default router;