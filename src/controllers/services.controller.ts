import Service from "../schemats/serviceSchema";
import { Response, Request } from "express";

async function getAllServices(req: Request, res: Response) {
    try {
        const services = await Service.find();

        if (services) {
            return res.status(200).json({ services });
        } else {
            return res.status(404).json({ message: "Services not found" });
        }
    } catch (err) {
        return res.status(502).json({ message: "error" });
    }
}

async function createServices(req: Request, res: Response) {
    try {
        const { name, duration, cost } = req.body;

        const service = await Service.create({ serviceName: name, serviceDuration: duration, cost: cost });

        return res.status(201).json({ message: "Service successful created" });
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Error creating service" });
    }
}

async function updateService(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { name, duration, cost } = req.body;

        const updatedService = await Service.findByIdAndUpdate(
            id,
            { serviceName: name, serviceDuration: duration, cost: cost },
            { new: true }
        );

        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }

        return res
            .status(200)
            .json({ message: "Service successfully updated", updatedService });
    } catch (err) {
        return res.status(500).json({ message: "Error updating service" });
    }
}
async function deleteService(req: Request, res: Response) {
    try {
        const { id } = req.params;

        const service = await Service.findByIdAndDelete(id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        return res.status(200).json({ message: "Service successfully deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting service" });
    }
}
export { getAllServices, createServices, updateService, deleteService };
