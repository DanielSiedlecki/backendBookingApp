import * as express from "express";
import * as servicesController from "../controllers/services.controller";

const router = express.Router();

router.get("/getAllServices", servicesController.getAllServices);
router.post("/createServices", servicesController.createServices)
router.put('/service/:id', servicesController.updateService);
router.delete('/service/:id', servicesController.deleteService);

export default router;
