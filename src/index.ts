import express, { Express, Request, Response } from 'express'
import { sendNotFoundError } from './error-handlers';
import apiRouter from './api-router';

const app: Express = express();

app.use("/api", apiRouter)

app.all("*", (req: Request, res: Response) => {
  sendNotFoundError(res)
})

export default app