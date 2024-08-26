import express from "express"
import { getExercises } from "../controllers/exercises.controllers"

const exercisesRouter = express.Router()

exercisesRouter.get("/", getExercises)

export default exercisesRouter