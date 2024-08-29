import { Db } from "mongodb"
import { Exercise, User } from "../types";

const seed = async (db: Db, users: User[], exercises: Exercise[]) => {
    await db.collection("users").drop()
    await db.collection("users").insertMany(users);
    await db.collection("exercises").drop()
    await db.collection("exercises").insertMany(exercises)
}

export default seed