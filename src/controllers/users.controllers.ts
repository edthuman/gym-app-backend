import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError, sendConflictError } from "../error-handlers"
import { generateUserErrorMessage } from "../utils/user.utils"

const getUsers = async (req: Request, res: Response) => {
    const users = await selectAllUsers()
    res.send({ users })
}

const postUser = async (req: Request, res: Response) => {
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

export { getUsers, postUser }