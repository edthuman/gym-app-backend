import express, { Request, Response } from "express"
import { getUsers } from "../controllers/users.controllers"

const usersRouter = express.Router()

usersRouter.get("/", (req: Request, res: Response) => {
    getUsers(req, res)
})

export default usersRouter