import express from "express"
import { getAllExercises } from "../controllers/exercises.controllers"

const exercisesRouter = express.Router()

exercisesRouter.get("/", getAllExercises)

export default exercisesRouter