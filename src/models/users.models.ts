import { ObjectId } from "mongodb";
import db from "../../connection"
import { User } from "../types";

export const selectAllUsers = async () => {
    try {
        const usersArray = [];
        const usersCluster = (await db).collection("users").find({});
        for await (const user of usersCluster) {
            const { _id, username } = user
            usersArray.push({ _id, username })
        }
        return usersArray
    }
    catch {
        return []
    }
}

export const insertUser = async (user: User) => {
    try {
        const isDuplicateUser = await findUser(user)
        if (isDuplicateUser) {
            return { isDuplicateUser: true }
        }
        
        const response = await (await db).collection("users").insertOne(user)
        
        const _id = response.insertedId
        const { username } = user
    
        return { _id, username }
    }
    catch {
        return {}
    }
}

const findUser = async (user: User) => {
    const matchingUser = await (await db).collection("users").findOne(user)
    return matchingUser
}

export const selectUserById = async (id: ObjectId) => {
    try {
        const user = await (await db).collection("users").findOne({ _id: id })
        return user
    }
    catch {
        return { isError: true }
    }
}

export const selectUserByUsername = async (username: any) => {
    try {
        const user: any = await (await db).collection("users").findOne({ username })
        return user
    }
    catch {
        return { isError: true }
    }
}