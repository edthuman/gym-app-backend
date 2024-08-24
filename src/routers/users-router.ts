import express from "express"
import { getUsers, postUser } from "../controllers/users.controllers"

const usersRouter = express.Router()

usersRouter.get("/", getUsers)

usersRouter.post("/", postUser)

export default usersRouter