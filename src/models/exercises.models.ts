import db from "../../connection"

export const selectAllExercises = async () => {
    const exercises = []
    const exerciseCluster = (await db).collection("exercises").find({})
    for await (const exercise of exerciseCluster) {
        exercises.push(exercise)
    }
    return exercises
}