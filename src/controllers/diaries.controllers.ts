import { Response, Request } from "express"
import { selectAllDiaries } from "../models/diaries.models"

export const getAllDiaries = async (req: Request, res: Response) => {
    const diaries = await selectAllDiaries()
    res.send({ diaries })
}