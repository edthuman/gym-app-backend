import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError } from "../error-handlers"
import { generateUserErrorMessage } from "../utils/user.utils"

export const getUsers = async (req: Request, res: Response) => {
    const { sort, order } = req.query
    const users = await selectAllUsers()

    const isServerError = users.length === 0
    if (isServerError) {
        sendInternalServerError(res, "Error fetching users")
        return
    }

    if (sort === "username" || sort === "") {
        users.sort((a, b) => {
            const x = a.username.toLowerCase()
            const y = b.username.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
    }
    if (order === "DESC" || order === "desc" || order === "descending") {
        users.reverse()
    }
    res.send({ users })
}

export const postUser = async (req: Request, res: Response) => {
    const userObject = req.body

    const userErrorMessage = generateUserErrorMessage(userObject)
    if (userErrorMessage) {
        sendBadRequestError(res, userErrorMessage)
        return
    }
    const user = await insertUser(userObject)
    if (user._id === undefined) {
        sendInternalServerError(res, "Error uploading user")
        return
    }
    
    if (user.isDuplicateUser) {
        sendConflictError(res, "A user already exists with given username")
        return 
    }
    res.status(201).send({ user })
}