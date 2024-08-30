import express, { Express, Request, Response } from 'express'
import { sendEndpointNotFoundError } from './error-handlers';
import apiRouter from './routers/api-router';

const app: Express = express();

app.use(express.json())

app.use("/api", apiRouter)

app.all("*", (req: Request, res: Response) => {
  sendEndpointNotFoundError(res)
})

export default app