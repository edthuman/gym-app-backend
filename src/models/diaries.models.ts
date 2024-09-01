import db from "../../connection"

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