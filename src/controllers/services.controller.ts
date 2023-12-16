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

export { getAllServices }