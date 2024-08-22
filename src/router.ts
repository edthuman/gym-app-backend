import express, { Request, Response } from "express"
import { readFile } from "fs";
import { sendMethodNotAllowedError } from "./error-handlers"

const router = express.Router()

router.get("/api", (req: Request, res: Response) => {
  readFile(`${__dirname}/../endpoints.json`, { encoding: "utf-8" }, (err, endpointsJSON)=>{
    if (err) {
      res.status(500).send(err)
    } else {
      const parsedEndpoints = JSON.parse(endpointsJSON)
      res.send({ endpoints : parsedEndpoints })
    }
  })
});

router.post("/api", (req: Request, res: Response) => {
  sendMethodNotAllowedError(res)
})

router.patch("/api", (req: Request, res: Response) => {
  sendMethodNotAllowedError(res)
})

router.delete("/api", (req: Request, res: Response) => {
  sendMethodNotAllowedError(res)
})

export default router