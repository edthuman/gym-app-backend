import { Request, Response } from "express"

export const sendBadRequestError = (res: Response, msg: string) => {
    res.status(400).send({ msg })
}

export const sendInvalidQueryError = (res: Response) => {
    res.status(400).send({ msg: "Invalid query"})
}

export const sendInvalidSortError = (res: Response) => {
    res.status(400).send({msg: "Invalid sort query"})
}

export const sendInvalidOrderError = (res: Response) => {
    res.status(400).send({msg: "Invalid order query"})
}

export const sendEndpointNotFoundError = (res: Response) => {
    res.status(404).send({msg: "Requested endpoint does not exist"})
}

export const sendNotFoundError = (res: Response, msg: string) => {
    res.status(404).send({msg})
}

export const sendMethodNotAllowedError = (req: Request, res: Response) => {
    res.status(405).send({msg: "Request method not allowed on this endpoint"})
}

export const sendConflictError = (res: Response, msg: string) => {
    res.status(409).send({msg})
}

export const sendInternalServerError = (res: Response, msg: string) => {
    res.status(500).send({msg})
}