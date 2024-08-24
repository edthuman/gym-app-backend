import express, { Request, Response } from "express"
import { getUsers, postUser } from "../controllers/users.controllers"
import { sendBadRequestError, sendMethodNotAllowedError } from "../error-handlers"

const usersRouter = express.Router()

usersRouter.get("/", getUsers)
usersRouter.post("/", postUser)
usersRouter.all("/", sendMethodNotAllowedError)

export default usersRouter