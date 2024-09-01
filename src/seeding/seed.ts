import { Db } from "mongodb"
import { Exercise, Diary, User } from "../types";

const seed = async (db: Db, users: User[], exercises: Exercise[], diaries: Diary[]) => {
    await db.collection("users").drop()
    await db.collection("users").insertMany(users);
    await db.collection("exercises").drop()
    await db.collection("exercises").insertMany(exercises)
    await db.collection("diaries").drop()
    await db.collection("diaries").insertMany(diaries)
}

export default seed