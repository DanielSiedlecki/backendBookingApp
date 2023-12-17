import express from 'express';
import * as hairdressersController from '../controllers/hairdressers.controller'
const router = express.Router();

router.put('/users/:id/role/hairdresser', hairdressersController.setHairdresserRoleToUser);


router.put('/users/:id/services', hairdressersController.setServiceToUser);


router.get('/hairdressers', hairdressersController.getHairdressers);

export default router;