import express from "express"
import { getAllExercises } from "../controllers/exercises.controllers"
import { sendMethodNotAllowedError } from "../error-handlers"

const exercisesRouter = express.Router()

exercisesRouter.get("/", getAllExercises)
exercisesRouter.use("/", sendMethodNotAllowedError)

export default exercisesRouter