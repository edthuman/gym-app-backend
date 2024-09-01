import { Request, Response } from "express";
import { insertExercise, selectAllExercises, selectExerciseByName } from "../models/exercises.models";
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidQueryError, sendNotFoundError } from "../error-handlers";
import { checkExerciseOrder, checkExerciseSort, findInvalidExerciseQueries, getExerciseErrorMessage, sortExercises } from "../utils/exercise.utils";

export const getAllExercises = async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    const isInvalidQuery = findInvalidExerciseQueries(queries)
    if (isInvalidQuery) {
        sendInvalidQueryError(res)
        return
    }

    const { name, sort, order } = req.query
    
    if (name === "") {
        sendBadRequestError(res, "No name given")
        return
    }
    if (typeof name === "string") {
        getExerciseByName(res, name)
        return
    }

    const isInvalidSort = checkExerciseSort(sort)
    if (isInvalidSort) {
        sendBadRequestError(res, "Invalid sort query")
        return
    }

    const isOrderInvalid = checkExerciseOrder(order)
    if (isOrderInvalid) {
        sendBadRequestError(res, "Invalid order query")
        return
    }

    const exercises = await selectAllExercises()
    const isError = exercises.length === 0
    if (isError) {
        sendInternalServerError(res, "Error fetching exercises")
    }

    const sortedExercises = sortExercises(exercises, sort, order)
    res.status(200).send({ exercises: sortedExercises })
}

export const postExercise = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        sendInvalidQueryError(res)
        return
    }
    const exerciseInput = req.body

    const exerciseError = getExerciseErrorMessage(exerciseInput)
    if (exerciseError) {
        sendBadRequestError(res, exerciseError)
        return
    }

    const exercise = await insertExercise(exerciseInput)
    if (exercise.isDuplicateExercise) {
        sendConflictError(res, "An exercise already exists with that name")
        return
    }
    if (exercise._id === undefined) {
        sendInternalServerError(res, "Error posting exercise")
        return
    }
    res.status(201).send({exercise})
}

const getExerciseByName = async (res: Response, name: string) => {
    const exercise: any = await selectExerciseByName(name)
    if (exercise === null) {
        sendNotFoundError(res, "No exercises found")
        return
    }
    if (exercise.isError) {
        sendInternalServerError(res, "Error fetching exercises")
        return
    }
    res.send({exercises: [exercise]})
}