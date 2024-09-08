import { Response, Request } from "express"
import { insertDiary, selectAllDiaries, selectDiary } from "../models/diaries.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidOrderError, sendInvalidQueryError, sendInvalidSortError } from "../error-handlers"
import { checkDiaryOrder, checkDiarySort, generateDiaryErrorMessage } from "../utils/diary.utils"
import { selectUserByUsername } from "../models/users.models"
import { selectExerciseByName } from "../models/exercises.models"
import { MongoDBDiary } from "../types"

export const getAllDiaries = async (req: Request, res: Response) => {
    const { sort, order, username } = req.query

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

    const isInvalidOrder = checkDiaryOrder(order)
    if (isInvalidOrder) {
        sendInvalidOrderError(res)
        return
    }

    if (username === "") {
        sendBadRequestError(res, "No username given")
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
    
    const descendingOrder: any[] = ["desc", "DESC", "descending"] // declared as any so non-string values for order don't cause a type error
    const isDescending = descendingOrder.includes(order)
    if (isDescending) {
        diaries.reverse()
    }

    if (username) {
        const userQueries = diaries.filter((diary: MongoDBDiary) => diary.username === username)
        res.send({diaries: userQueries})
        return
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