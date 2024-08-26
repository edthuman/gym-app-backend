import db from "../../connection"
import { UserInput } from "../types";

export const selectAllUsers = async () => {
    const usersArray = [];
    const usersCluster = (await db).collection("users").find({});
    for await (const user of usersCluster) {
        usersArray.push(user)
    }
    return usersArray
}

export const insertUser = async (user: UserInput) => {
    const isDuplicateUser = await findUser(user)
    if (isDuplicateUser) {
        return { isDuplicateUser: true }
    }

    const response = await (await db).collection("users").insertOne(user)

    if (!response.insertedId) {
        return {}
    }
    
    const _id = response.insertedId
    const { username } = user

    return { _id, username }
}

const findUser = async (user: UserInput) => {
    const matchingUser = await (await db).collection("users").findOne(user)
    return matchingUser
}