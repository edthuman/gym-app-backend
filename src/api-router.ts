import express, { Request, Response } from "express"
import { readFile } from "fs";
import { sendMethodNotAllowedError } from "./error-handlers"

const apiRouter = express.Router()

apiRouter.get("/", (req: Request, res: Response) => {
  readFile(`${__dirname}/../endpoints.json`, { encoding: "utf-8" }, (err, endpointsJSON)=>{
    if (err) {
      res.status(500).send(err)
    } else {
      const parsedEndpoints = JSON.parse(endpointsJSON)
      res.send({ endpoints : parsedEndpoints })
    }
  })
});

apiRouter.all("/", (req: Request, res: Response) => {
  sendMethodNotAllowedError(res)
})

export default apiRouter