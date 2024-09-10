import { Response, Request } from "express"
import { findDuplicateDiary, insertDiary, removeDiary, selectAllDiaries, selectDiaryById, updateDiary } from "../models/diaries.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidOrderError, sendInvalidQueryError, sendInvalidSortError, sendNotFoundError } from "../error-handlers"
import { checkDiaryOrder, checkDiaryQueries, checkDiarySort, formatPatchObject, generateDiaryErrorMessage } from "../utils/diary.utils"
import { selectUserByUsername } from "../models/users.models"
import { selectExerciseByName } from "../models/exercises.models"
import { MongoDBDiary } from "../types"
import { ObjectId } from "mongodb"

export const getAllDiaries = async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    
    const isInvalidQuery = checkDiaryQueries(queries)
    if (isInvalidQuery) {
        sendInvalidQueryError(res)
        return
    }
    
    const { sort, order, username, exercise } = req.query

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

    if (username) {
        if (Array.isArray(username)) {
            sendBadRequestError(res, "Multiple username queries given")
            return
        } 
        const user = await selectUserByUsername(username)
        if (!user) {
            sendNotFoundError(res, "Username not found")
            return
        }
        if (user.isError) {
            sendInternalServerError(res, "Error fetching diaries")
            return
        }
    }
    
    if (exercise === "") {
        sendBadRequestError(res, "No exercise given")
        return
    }

    if (exercise) {
        if (Array.isArray(exercise)) {
            sendBadRequestError(res, "Multiple exercise queries given")
            return
        }
        const isExercise = await selectExerciseByName(exercise)
        if (!isExercise) {
            sendNotFoundError(res, "Exercise not found")
            return
        }
        if (isExercise.isError) {
            sendInternalServerError(res, "Error fetching diaries")
            return
        }
    }

    let diaries: any = await selectAllDiaries()
    if (diaries.isError) {
        sendInternalServerError(res, "Error fetching diaries")
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
        diaries = userQueries
    }

    if (exercise) {
        const exerciseQueries = diaries.filter((diary: MongoDBDiary) => diary.exercise === exercise)
        diaries = exerciseQueries
    }

    if (diaries.length === 0) {
        sendNotFoundError(res, "No diaries found")
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

    const isDiaryDuplicate = await findDuplicateDiary(username, exercise)
    if (isDiaryDuplicate && isDiaryDuplicate.isError) {
        sendInternalServerError(res, "Error posting diary")
        return
    }
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

export const getDiaryById = async (req: Request, res: Response) => {
    const givenId = req.params.diary_id

    let id: ObjectId
    try {
        id = new ObjectId(givenId)
    }
    catch {
        sendBadRequestError(res, "Invalid diary id")
        return
    }
    
    const diary = await selectDiaryById(id)
    if (!diary) {
        sendNotFoundError(res, "Diary not found")
        return
    }
    if (diary.isError) {
        sendInternalServerError(res, "Error fetching diary")
        return
    }

    res.send({ diary })
}

export const deleteDiary = async (req: Request, res: Response) => {
    const givenId = req.params.diary_id

    let id: ObjectId
    try {
        id = new ObjectId(givenId)
    }
    catch {
        sendBadRequestError(res, "Invalid diary id")
        return
    }
    
    const isIdValid: any = await selectDiaryById(id)
    if (!isIdValid) {
        sendNotFoundError(res, "Diary not found")
        return
    }
    if (isIdValid.isError) {
        sendInternalServerError(res, "Error deleting diary")
        return
    }

    const deletedDiary = await removeDiary(id)
    if (deletedDiary.isError || deletedDiary.deleted === false) {
        sendInternalServerError(res, "Error deleting diary")
    }
    res.status(204).send()
}

export const patchDiary = async (req: Request, res: Response) => {
    const givenId = req.params.diary_id
    const id = new ObjectId(givenId)

    const body = req.body

    let highestLog = 0
    if (Object.keys(body).includes("logs")) {
        for (let i = 0; i < body.logs.length; i++) {
            if (highestLog < body.logs[i].log) {
                highestLog = body.logs[i].log
            }
        }
    }
    
    const diaryToPatch: any = await selectDiaryById(id)
    if (diaryToPatch.personalBest < highestLog) {
        body.personalBest = highestLog
    }

    const patchObject = formatPatchObject(body)

    const updateAttempt = await updateDiary(id, patchObject)
    if (!updateAttempt.success) {
        sendInternalServerError(res, "Error patching diary")
        return
    }

    const updatedDiary = await selectDiaryById(id)
    res.send({ diary: updatedDiary })
}