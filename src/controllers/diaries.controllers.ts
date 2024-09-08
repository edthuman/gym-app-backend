import { Response, Request } from "express"
import { insertDiary, selectAllDiaries, selectDiary } from "../models/diaries.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidQueryError, sendInvalidSortError } from "../error-handlers"
import { checkDiarySort, generateDiaryErrorMessage } from "../utils/diary.utils"
import { selectUserByUsername } from "../models/users.models"
import { selectExerciseByName } from "../models/exercises.models"
import { MongoDBDiary } from "../types"

export const getAllDiaries = async (req: Request, res: Response) => {
    const { sort, order } = req.query

    const diaries: any = await selectAllDiaries()
    if (diaries.isError) {
        sendInternalServerError(res, "Error fetching diaries")
        return
    }

    const isInvalidSort = checkDiarySort(sort)
    if (isInvalidSort) {
        sendInvalidSortError(res)
        return
    }
    
    if (sort === "username" || sort === "exercise") {
        diaries.sort((a: MongoDBDiary, b: MongoDBDiary)=>{
            const x = a[sort].toLowerCase()
            const y = b[sort].toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
    }
    
    if (order === "desc" || order === "DESC" || order === "descending") {
        diaries.reverse()
    }

    res.send({ diaries })
}

export const postDiary = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        sendInvalidQueryError(res)
        return
    }

    const diaryObject = req.body

    const diaryError = generateDiaryErrorMessage(diaryObject)
    if (diaryError) {
        sendBadRequestError(res, diaryError)
        return
    }

    const { username, exercise } = diaryObject
    const isValidUsername = await selectUserByUsername(username)

    if (!isValidUsername) {
        sendBadRequestError(res, "No user exists with given username")
        return
    }
    if (isValidUsername.isError) {
        sendInternalServerError(res, "Error posting diary")
    }

    const isValidExercise = await selectExerciseByName(exercise)
    if (!isValidExercise) {
        sendBadRequestError(res, "Exercise does not exist")
        return
    }
    if (isValidExercise.isError) {
        sendInternalServerError(res, "Error posting diary")
        return
    }

    const isDiaryDuplicate = await selectDiary(username, exercise)
    if (isDiaryDuplicate) {
        sendConflictError(res, "Diary already exists")
        return
    }

    const diary = await insertDiary(diaryObject)

    if (diary.isError) {
        sendInternalServerError(res, "Error posting diary")
        return
    }

    res.status(201).send({diary})
}