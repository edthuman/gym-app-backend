import db from "../../connection"
import { Exercise } from "../types"

export const selectAllExercises = async () => {
    try {
        const exercises = []
        const exercisesCluster = (await db).collection("exercises").find({})
        for await (const exercise of exercisesCluster) {
            exercises.push(exercise)
        }
        return exercises
    }
    catch {
        return []
    }
}

export const insertExercise = async (exercise: Exercise) => {
    try {
        const { insertedId } = await (await db).collection("exercises").insertOne(exercise)
        const { name, description, icon } = exercise

        return { 
            _id: insertedId,
            name,
            description,
            icon 
        }
    }
    catch {
        return {}
    }
}