import Service from '../schemats/serviceSchema';
import { Response, Request } from 'express'

async function getAllServices(res: Response, req: Request) {

    try {

        const services = await Service.find()

        if (services) {
            return res.status(200).json({ services });
        }
        else {
            return res.status(404).json({ message: "Services not found" })
        }

    } catch (err) {
        return res.status(502).json({ message: "error" })
    }


}

async function createServices(res: Response, req: Request) {

    try {

        const { name, duration, cost } = req.body

        const service = await Service.create({ name, duration, cost });

        return res.status(201).json({ message: "Service successful created" })



    } catch (err) {
        return res.status(500).json({ message: "Error creating service" });
    }


}

export { getAllServices, createServices }