import * as express from "express";
import * as servicesController from "../controllers/services.controller";

const router = express.Router();

router.get("/getAllServices", servicesController.getAllServices);
router.post("/createServices", servicesController.createServices)

export default router;
