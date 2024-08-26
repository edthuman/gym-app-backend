import db from "../../connection"

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