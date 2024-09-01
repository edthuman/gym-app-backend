import db from "../../connection"

export const selectAllDiaries = async () => {
    const diariesCluster = await (await db).collection("diaries").find({})
    const diaries = []

    for await (const diary of diariesCluster) {
        diaries.push(diary)
    }

    return diaries
}