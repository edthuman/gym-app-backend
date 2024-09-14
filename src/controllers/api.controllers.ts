import { Request, Response } from "express";
import { selectEndpoints } from "../models/api.models";
import { sendInternalServerError, sendInvalidQueryError } from "../error-handlers";

export const getEndpoints = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0

    if (isQuery) {
        return sendInvalidQueryError(res)
    }

    const endpoints = selectEndpoints()
    if (endpoints === "") {
        return sendInternalServerError(res, "Error fetching endpoints")
    }
    res.send({ endpoints })
}