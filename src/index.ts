import express, { Express, Request, Response } from 'express'
import router from './router'
import { sendNotFoundError } from './error-handlers';

const app: Express = express();

app.use(router)

app.all("*", (req: Request, res: Response) => {
  sendNotFoundError(res)
})

export default app