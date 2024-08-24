import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError } from "../error-handlers"
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
    res.status(201).send({ user })
    }
}

export { getUsers, postUser }