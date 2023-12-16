import * as express from "express";
import * as servicesController from "../controllers/services.controller";

const router = express.Router();

router.get("./getAllServices", servicesController.getAllServices);

export default router;
