import { Request, Response } from "express";
import { selectEndpoints } from "../models/api.models";
import { sendInternalServerError, sendInvalidQueryError } from "../error-handlers";

export const getEndpoints = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0

    if (isQuery) {
        sendInvalidQueryError(res)
        return
    }

    const endpoints = selectEndpoints()
    if (endpoints === "") {
        sendInternalServerError(res, "Error fetching endpoints")
        return
    }
    res.send({ endpoints })
}