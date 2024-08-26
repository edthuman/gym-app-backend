import { Request, Response } from "express";
import { selectAllExercises } from "../models/exercises.models";

export const getExercises = async (req: Request, res: Response) => {
    const exercises = await selectAllExercises()
    res.status(200).send({ exercises })
}