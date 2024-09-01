import { Db } from "mongodb"
import { Exercise, Diary, User } from "../types";

const seed = async (db: Db, users: User[], exercises: Exercise[], logs: Diary[]) => {
    await db.collection("users").drop()
    await db.collection("users").insertMany(users);
    await db.collection("exercises").drop()
    await db.collection("exercises").insertMany(exercises)
    await db.collection("logs").drop()
    await db.collection("logs").insertMany(logs)
}

export default seed