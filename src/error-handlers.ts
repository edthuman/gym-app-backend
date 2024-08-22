import { Response } from "express"

const sendMethodNotAllowedError = (res: Response) => {
    res.status(405).send({msg: "Request method not allowed on this endpoint"})
}

export { sendMethodNotAllowedError }