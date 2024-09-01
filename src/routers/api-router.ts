import express from "express"
import { getEndpoints } from "../controllers/api.controllers";
import { sendMethodNotAllowedError } from "../error-handlers"
import usersRouter from "../routers/users-router";
import exercisesRouter from "../routers/exercises-router";
import diariesRouter from "./diaries-router";

const apiRouter = express.Router()

apiRouter.get("/", getEndpoints);

apiRouter.all("/", sendMethodNotAllowedError)

apiRouter.use("/users", usersRouter)

apiRouter.use("/exercises", exercisesRouter)

apiRouter.use("/diaries", diariesRouter)

export default apiRouter