import { Response, Request } from "express"
import { selectAllDiaries } from "../models/diaries.models"
import { sendInternalServerError } from "../error-handlers"

export const getAllDiaries = async (req: Request, res: Response) => {
    const diaries: any = await selectAllDiaries()
    if (diaries.isError) {
        sendInternalServerError(res, "Error fetching diaries")
        return
    }
    res.send({ diaries })
}