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

export const selectDiaryById = async (id: ObjectId) => {
    try {
        const diary =  await (await db).collection("diaries").findOne({ _id: id})
        return diary
    }
    catch {
        return { isError: true }
    }
}

export const findDuplicateDiary = async (username: string, exercise: string) => {
    try {
        const diary = await (await db).collection("diaries").findOne({ username, exercise })
        return diary
    }
    catch {
        return { isError: true }
    }
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

export const removeDiary = async (id: ObjectId) => {
    try {
        const response = await (await db).collection("diaries").deleteOne({_id: id})

        if (response.deletedCount === 1) {
            return { deleted: true }
        }
        return { deleted: false }
    }
    catch {
        return { isError: true }
    }
}

export const updateDiary = async (id: ObjectId, patchInstructions: any) => {
    const response = await (await db).collection("diaries").updateOne({_id: id}, patchInstructions)

    if (response.modifiedCount === 1) {
        return { success: true }
    }
    return { success: false }
}