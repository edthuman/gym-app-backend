import { Request, Response } from "express";
import { insertExercise, selectAllExercises } from "../models/exercises.models";
import { sendBadRequestError, sendInternalServerError } from "../error-handlers";
import { getExerciseErrorMessage, sortExercises } from "../utils/exercise.utils";

export const getAllExercises = async (req: Request, res: Response) => {
    const exercises = await selectAllExercises()
    const isError = exercises.length === 0
    if (isError) {
        sendInternalServerError(res, "Error fetching exercises")
    }

    const { sort } = req.query
    const sortedExercises = sortExercises(exercises, sort, null)
    res.status(200).send({ exercises: sortedExercises })
}

export const postExercise = async (req: Request, res: Response) => {
    const exerciseInput = req.body

    const exerciseError = getExerciseErrorMessage(exerciseInput)
    if (exerciseError) {
        sendBadRequestError(res, exerciseError)
        return
    }

    const exercise = await insertExercise(exerciseInput)
    if (exercise.isDuplicateExercise) {
        sendBadRequestError(res, "An exercise already exists with that name")
        return
    }
    if (exercise._id === undefined) {
        sendInternalServerError(res, "Error posting exercise")
        return
    }
    res.status(201).send({exercise})
}