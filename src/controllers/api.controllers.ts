import { Request, Response } from "express";
import { selectEndpoints } from "../models/api.models";

const getEndpoints = async (req: Request, res: Response) => {
    const endpoints = selectEndpoints()
    res.send({ endpoints })
}

export { getEndpoints }