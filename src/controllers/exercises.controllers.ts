import { Request, Response } from "express";
import { insertExercise, selectAllExercises, selectExerciseByName } from "../models/exercises.models";
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidQueryError, sendInvalidSortError, sendNotFoundError } from "../error-handlers";
import { checkExerciseOrder, checkExerciseSort, findInvalidExerciseQueries, getExerciseError, sortExercises } from "../utils/exercise.utils";

export const getAllExercises = async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    const isInvalidQuery = findInvalidExerciseQueries(queries)
    if (isInvalidQuery) {
        return sendInvalidQueryError(res)
    }

    const { name, sort, order } = req.query
    
    if (Array.isArray(name)) {
        return sendBadRequestError(res, "Multiple name queries given")
    }
    if (name === "") {
        return sendBadRequestError(res, "No name given")
    }
    if (typeof name === "string") {
        return getExerciseByName(res, name)
    }

    const isInvalidSort = checkExerciseSort(sort)
    if (isInvalidSort) {
        return sendInvalidSortError(res)
    }

    const isInvalidOrder = checkExerciseOrder(order)
    if (isInvalidOrder) {
        return sendBadRequestError(res, "Invalid order query")
    }

    const exercises = await selectAllExercises()
    const isError = exercises.length === 0
    if (isError) {
        return sendInternalServerError(res, "Error fetching exercises")
    }

    const sortedExercises = sortExercises(exercises, sort, order)
    res.status(200).send({ exercises: sortedExercises })
}

export const postExercise = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        return sendInvalidQueryError(res)
    }
    const exerciseInput = req.body

    const exerciseError = getExerciseError(exerciseInput)
    if (exerciseError) {
        return sendBadRequestError(res, exerciseError)
    }

    const exercise = await insertExercise(exerciseInput)
    if (exercise.isDuplicateExercise) {
        return sendConflictError(res, "An exercise already exists with that name")
    }
    if (exercise._id === undefined) {
        return sendInternalServerError(res, "Error posting exercise")
    }
    res.status(201).send({exercise})
}

const getExerciseByName = async (res: Response, name: string) => {
    const exercise: any = await selectExerciseByName(name)
    if (exercise === null) {
        return sendNotFoundError(res, "No exercises found")
    }
    if (exercise.isError) {
        return sendInternalServerError(res, "Error fetching exercises")
    }
    res.send({exercises: [exercise]})
}