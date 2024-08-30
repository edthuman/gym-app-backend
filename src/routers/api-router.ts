import express, { Request, Response } from "express"
import { getEndpoints } from "../controllers/api.controllers";
import { sendMethodNotAllowedError } from "../error-handlers"
import usersRouter from "../routers/users-router";
import exercisesRouter from "../routers/exercises-router";

const apiRouter = express.Router()

apiRouter.get("/", getEndpoints);

apiRouter.all("/", sendMethodNotAllowedError)

apiRouter.use("/users", usersRouter)

apiRouter.use("/exercises", exercisesRouter)

export default apiRouter