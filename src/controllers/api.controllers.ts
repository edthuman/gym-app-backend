import { Request, Response } from "express";
import { selectEndpoints } from "../models/api.models";
import { sendInternalServerError } from "../error-handlers";

export const getEndpoints = async (req: Request, res: Response) => {
    const endpoints = selectEndpoints()
    if (endpoints === "") {
        sendInternalServerError(res, "Error fetching endpoints")
        return
    }
    res.send({ endpoints })
}