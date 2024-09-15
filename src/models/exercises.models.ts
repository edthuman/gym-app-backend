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
        const isDuplicateExercise = await findExercise(exercise)
        if (isDuplicateExercise) {
            return { isDuplicateExercise }
        }

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

const findExercise = async (exercise: Exercise) => {
    // try catch not used as error will be caught in insertExercise
    const exerciseRegex = new RegExp(`^${exercise.name}$`, "i") // case insensitive exercise name
    const matchingExercise = await (await db).collection("exercises").findOne({ name: exerciseRegex })
    return matchingExercise
}

export const selectExerciseByName = async (name: any) => {
    try {
        const exercise = await (await db).collection("exercises").findOne({ name })
        return exercise
    }
    catch {
        return {isError: true}
    }
}