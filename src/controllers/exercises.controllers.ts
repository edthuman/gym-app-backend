import { Request, Response } from "express";
import { insertExercise, selectAllExercises } from "../models/exercises.models";
import { sendInternalServerError } from "../error-handlers";

export const getAllExercises = async (req: Request, res: Response) => {
    const exercises = await selectAllExercises()
    const isError = exercises.length === 0
    if (isError) {
        sendInternalServerError(res, "Error fetching exercises")
    }
    res.status(200).send({ exercises })
}

export const postExercise = async (req: Request, res: Response) => {
    const exerciseInput = req.body
    const exercise = await insertExercise(exerciseInput)
    res.status(201).send({exercise})
}