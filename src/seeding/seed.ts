import { Db } from "mongodb"
import { UserInput } from "../types";

const seed = async (db: Db, users: UserInput[]) => {
    await db.collection("users").drop()
    await db.collection("users").insertMany(users);
}

export default seed