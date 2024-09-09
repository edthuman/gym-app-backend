import { ObjectId } from "mongodb"
import db from "../../connection"
import { Diary } from "../types"

export const selectAllDiaries = async () => {
    try {
        const diariesCluster = await (await db).collection("diaries").find({})
        const diaries = []
    
        for await (const diary of diariesCluster) {
            diaries.push(diary)
        }
    
        return diaries
    }
    catch {
        return {isError: true}
    }
}

export const selectDiaryByID = async (id: ObjectId) => {
    const diary =  await (await db).collection("diaries").findOne({ _id: id})
    return diary
}

export const selectDiaryByUsernameAndExercise = async (username: string, exercise: string) => {
    const diary = await (await db).collection("diaries").findOne({ username, exercise })
    return diary
}

export const insertDiary = async (diary: Diary) => {
    try {
        const response = await (await db).collection("diaries").insertOne(diary)
        const id = response.insertedId
    
        return {
            _id: id,
            ...diary,
            logs: []
        }
    }
    catch {
        return {isError: true}
    }
}