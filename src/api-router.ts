import express, { Request, Response } from "express"
import { getEndpoints } from "./controllers/api.controllers";
import { sendMethodNotAllowedError } from "./error-handlers"
import usersRouter from "./routers/users-router";

const apiRouter = express.Router()

apiRouter.get("/", getEndpoints);

apiRouter.all("/", (req: Request, res: Response) => {
  sendMethodNotAllowedError(res)
})

apiRouter.use("/users", usersRouter)

export default apiRouter