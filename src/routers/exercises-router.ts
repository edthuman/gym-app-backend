import express from "express"
import { getAllExercises, postExercise } from "../controllers/exercises.controllers"
import { sendMethodNotAllowedError } from "../error-handlers"

const exercisesRouter = express.Router()

exercisesRouter.get("/", getAllExercises)
exercisesRouter.post("/", postExercise)
exercisesRouter.use("/", sendMethodNotAllowedError)

export default exercisesRouter