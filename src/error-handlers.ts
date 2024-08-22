import { Response } from "express"

const sendNotFoundError = (res: Response) => {
    res.status(404).send({msg: "Requested endpoint does not exist"})
}

const sendMethodNotAllowedError = (res: Response) => {
    res.status(405).send({msg: "Request method not allowed on this endpoint"})
}

export { sendNotFoundError, sendMethodNotAllowedError }