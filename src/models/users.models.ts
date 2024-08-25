import { db } from "../../connection"
import { UserInput } from "../types";

const selectAllUsers = async () => {
    const usersArray = [];
    const usersCluster = (await db).collection("users").find({});
    for await (const user of usersCluster) {
        usersArray.push(user)
    }
    return usersArray
}

const insertUser = async (user: UserInput) => {
    const response = await (await db).collection("users").insertOne(user)
    
    const _id = response.insertedId
    const { username } = user

    return { _id, username }
}

const findUser = async (user: UserInput) => {
    const matchingUser = await (await db).collection("users").findOne(user)
    return matchingUser
}

export { selectAllUsers, insertUser }