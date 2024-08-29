import express from "express"
import { getAllUsers, getUserById, postUser } from "../controllers/users.controllers"
import { sendMethodNotAllowedError } from "../error-handlers"

const usersRouter = express.Router()

usersRouter.get("/", getAllUsers)
usersRouter.post("/", postUser)
usersRouter.all("/", sendMethodNotAllowedError)
usersRouter.get("/:user_id", getUserById)
usersRouter.use("/*", sendMethodNotAllowedError)

export default usersRouter