import { Request, Response } from "express";
import { selectAllExercises } from "../models/exercises.models";
import { sendInternalServerError } from "../error-handlers";

export const getExercises = async (req: Request, res: Response) => {
    const exercises = await selectAllExercises()
    const isError = exercises.length === 0
    if (isError) {
        sendInternalServerError(res, "Error fetching exercises")
    }
    res.status(200).send({ exercises })
}