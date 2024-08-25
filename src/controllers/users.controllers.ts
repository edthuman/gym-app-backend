import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError, sendConflictError } from "../error-handlers"
import { generateUserErrorMessage } from "../utils/user.utils"

export const getUsers = async (req: Request, res: Response) => {
    const { sort, order } = req.query
    const users = await selectAllUsers()
    if (sort === "username" || sort === "") {
        users.sort((a, b) => {
            const x = a.username.toLowerCase()
            const y = b.username.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
    }
    if (order === "DESC") {
        users.reverse()
    }
    res.send({ users })
}

export const postUser = async (req: Request, res: Response) => {
    const userObject = req.body

    const userErrorMessage = generateUserErrorMessage(userObject)
    if (userErrorMessage) {
        sendBadRequestError(res, userErrorMessage)
    } else {
    const user = await insertUser(userObject)
    
    if (user.isDuplicateUser) {
        sendConflictError(res, "A user already exists with given username")
    } else {
        res.status(201).send({ user })
    }
    }
}