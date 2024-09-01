import { Response, Request } from "express"
import { insertDiary, selectAllDiaries } from "../models/diaries.models"
import { sendBadRequestError, sendInternalServerError } from "../error-handlers"
import { checkDiaryInvalid } from "../utils/diary.utils"

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

    const isInvalidDiary = checkDiaryInvalid(diaryObject)

    if (isInvalidDiary) {
        sendBadRequestError(res, "No username given")
        return
    }

    const diary = await insertDiary(diaryObject)

    if (diary.isError) {
        sendInternalServerError(res, "Error posting Diary")
        return
    }

    res.status(201).send({diary})
}