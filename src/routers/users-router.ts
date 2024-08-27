import express from "express"
import { getAllUsers, postUser } from "../controllers/users.controllers"
import { sendMethodNotAllowedError } from "../error-handlers"

const usersRouter = express.Router()

usersRouter.get("/", getAllUsers)
usersRouter.post("/", postUser)
usersRouter.all("/", sendMethodNotAllowedError)

export default usersRouter