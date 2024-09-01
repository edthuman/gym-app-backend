import { Response, Request } from "express"
import { insertDiary, selectAllDiaries } from "../models/diaries.models"
import { sendBadRequestError, sendInternalServerError } from "../error-handlers"

export const getAllDiaries = async (req: Request, res: Response) => {
    const diaries: any = await selectAllDiaries()
    if (diaries.isError) {
        sendInternalServerError(res, "Error fetching diaries")
        return
    }
    res.send({ diaries })
}

export const postDiary = async (req: Request, res: Response) => {
    const diaryObject = req.body

    if (diaryObject.username === undefined) {
        sendBadRequestError(res, "No username given")
    }

    const diary = await insertDiary(diaryObject)

    if (diary.isError) {
        sendInternalServerError(res, "Error posting Diary")
        return
    }

    res.status(201).send({diary})
}