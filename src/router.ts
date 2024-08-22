import express, { Request, Response } from "express"
import { readFile } from "fs";

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
  res.status(405).send({ msg : "Request method not allowed on this endpoint"})
})

export default router