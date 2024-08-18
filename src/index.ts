import express, { Express, Request, Response } from 'express'
import router from './router'

const app: Express = express();

app.use(router)

app.all("*", (req: Request, res: Response) => {
  res.status(404).send("Not found")
})

export default app