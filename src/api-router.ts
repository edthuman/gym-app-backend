import express, { Request, Response } from "express"
import { getEndpoints } from "./controllers/api.controllers";
import { sendMethodNotAllowedError } from "./error-handlers"

const apiRouter = express.Router()

apiRouter.get("/", getEndpoints);

apiRouter.all("/", (req: Request, res: Response) => {
  sendMethodNotAllowedError(res)
})

export default apiRouter