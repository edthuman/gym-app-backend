import { Request, Response } from "express"

export const sendEndpointNotFoundError = (res: Response) => {
    res.status(404).send({msg: "Requested endpoint does not exist"})
}

export const sendMethodNotAllowedError = (req: Request, res: Response) => {
    res.status(405).send({msg: "Request method not allowed on this endpoint"})
}

export const sendBadRequestError = (res: Response, msg: String) => {
    res.status(400).send({ msg })
}

export const sendConflictError = (res: Response, msg: String) => {
    res.status(409).send({msg})
}

export const sendInternalServerError = (res: Response, msg: String) => {
    res.status(500).send({msg})
}

export const sendNotFoundError = (res: Response, msg: string) => {
    res.status(404).send({msg})
}