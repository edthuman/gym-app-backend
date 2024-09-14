import { Response, Request } from "express"
import { findDuplicateDiary, insertDiary, removeDiary, selectAllDiaries, selectDiaryById, updateDiary } from "../models/diaries.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidOrderError, sendInvalidQueryError, sendInvalidSortError, sendNotFoundError } from "../error-handlers"
import { checkDiaryOrder, checkDiaryQueries, checkDiarySort, formatPatchObject, getDiaryError, getDiaryPatchError } from "../utils/diary.utils"
import { selectUserByUsername } from "../models/users.models"
import { selectExerciseByName } from "../models/exercises.models"
import { MongoDBDiary } from "../types"
import { ObjectId } from "mongodb"

export const getAllDiaries = async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    
    const isInvalidQuery = checkDiaryQueries(queries)
    if (isInvalidQuery) {
        return sendInvalidQueryError(res)
    }
    
    const { sort, order, username, exercise } = req.query

    const isInvalidSort = checkDiarySort(sort)
    if (isInvalidSort) {
        return sendInvalidSortError(res)
    }

    const isInvalidOrder = checkDiaryOrder(order)
    if (isInvalidOrder) {
        return sendInvalidOrderError(res)
    }

    if (username === "") {
        return sendBadRequestError(res, "No username given")
    }

    if (username) {
        if (Array.isArray(username)) {
            return sendBadRequestError(res, "Multiple username queries given")
        } 
        const user = await selectUserByUsername(username)
        if (!user) {
            return sendNotFoundError(res, "Username not found")
        }
        if (user.isError) {
            return sendInternalServerError(res, "Error fetching diaries")
        }
    }
    
    if (exercise === "") {
        return sendBadRequestError(res, "No exercise given")
    }

    if (exercise) {
        if (Array.isArray(exercise)) {
            return sendBadRequestError(res, "Multiple exercise queries given")
        }
        const isExercise = await selectExerciseByName(exercise)
        if (!isExercise) {
            return sendNotFoundError(res, "Exercise not found")     
        }
        if (isExercise.isError) {
            return sendInternalServerError(res, "Error fetching diaries")
        }
    }

    let diaries: any = await selectAllDiaries()
    if (diaries.isError) {
        return sendInternalServerError(res, "Error fetching diaries")
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
        return sendNotFoundError(res, "No diaries found")
    }

    res.send({ diaries })
}

export const postDiary = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        return sendInvalidQueryError(res)
    }

    const diaryObject = req.body

    const diaryError = getDiaryError(diaryObject)
    if (diaryError) {
        return sendBadRequestError(res, diaryError)
    }

    const { username, exercise } = diaryObject
    const isValidUsername = await selectUserByUsername(username)

    if (!isValidUsername) {
        return sendBadRequestError(res, "No user exists with given username")
    }
    if (isValidUsername.isError) {
        return sendInternalServerError(res, "Error posting diary")
    }

    const isValidExercise = await selectExerciseByName(exercise)
    if (!isValidExercise) {
        return sendBadRequestError(res, "Exercise does not exist")
    }
    if (isValidExercise.isError) {
        return sendInternalServerError(res, "Error posting diary")
    }

    const isDiaryDuplicate = await findDuplicateDiary(username, exercise)
    if (isDiaryDuplicate && isDiaryDuplicate.isError) {
        return sendInternalServerError(res, "Error posting diary")
    }
    if (isDiaryDuplicate) {
        return sendConflictError(res, "Diary already exists")
        
    }

    const diary = await insertDiary(diaryObject)

    if (diary.isError) {
        return sendInternalServerError(res, "Error posting diary")
    }

    res.status(201).send({diary})
}

export const getDiaryById = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length
    if (isQuery) {
        return sendInvalidQueryError(res)
    }

    const givenId = req.params.diary_id

    let id: ObjectId
    try {
        id = new ObjectId(givenId)
    }
    catch {
        return sendBadRequestError(res, "Invalid diary id")
    }
    
    const diary = await selectDiaryById(id)
    if (!diary) {
        return sendNotFoundError(res, "Diary not found")
    }
    if (diary.isError) {
        return sendInternalServerError(res, "Error fetching diary")
    }

    res.send({ diary })
}

export const deleteDiary = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length
    if (isQuery) {
        return sendInvalidQueryError(res)
    }

    const givenId = req.params.diary_id

    let id: ObjectId
    try {
        id = new ObjectId(givenId)
    }
    catch {
        return sendBadRequestError(res, "Invalid diary id")
    }
    
    const isIdValid: any = await selectDiaryById(id)
    if (!isIdValid) {
        return sendNotFoundError(res, "Diary not found")
    }
    if (isIdValid.isError) {
        return sendInternalServerError(res, "Error deleting diary")
    }

    const deletedDiary = await removeDiary(id)
    if (deletedDiary.isError || deletedDiary.deleted === false) {
        return sendInternalServerError(res, "Error deleting diary")
    }
    res.status(204).send()
}

export const patchDiary = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length
    if (isQuery) {
        return sendInvalidQueryError(res)
    }
    
    const givenId = req.params.diary_id
    const id = new ObjectId(givenId)

    const body = req.body

    const error = getDiaryPatchError(body)

    if (error) {
        return sendBadRequestError(res, error)
    }

    const {logs, personalBest, goal} = body
    
    const diaryToPatch: any = await selectDiaryById(id)

    const highestDiaryLog = Math.max(...diaryToPatch.logs.map((log:any)=>log.log)) 
    if (personalBest < highestDiaryLog) {
        return sendBadRequestError(res, "PersonalBest cannot be below a log")
    }
    if (goal < highestDiaryLog) {
        return sendBadRequestError(res, "Goal cannot be below a log")
    }

    let highestPatchLog = 0
    if (logs) {
        for (let i = 0; i < logs.length; i++) {
            if (highestPatchLog < logs[i].log) {
                highestPatchLog = logs[i].log
            }
        }
    }

    if (diaryToPatch.personalBest < highestPatchLog) {
        body.personalBest = highestPatchLog
    }

    const patchObject = formatPatchObject(body)

    const updateAttempt = await updateDiary(id, patchObject)
    if (!updateAttempt.success || updateAttempt.isError) {
        return sendInternalServerError(res, "Error patching diary")
    }

    const updatedDiary = await selectDiaryById(id)
    res.send({ diary: updatedDiary })
}