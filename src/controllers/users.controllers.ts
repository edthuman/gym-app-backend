import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError } from "../error-handlers"

const getUsers = async (req: Request, res: Response) => {
    const users = await selectAllUsers()
    res.send({ users })
}

const postUser = async (req: Request, res: Response) => {
    const userObject = req.body
    if (Object.keys(userObject).length === 0) {
        sendBadRequestError(res, "No request body given")
    } else if (userObject.username === undefined) {
        sendBadRequestError(res, "No username given")
    } else {
        const user = await insertUser(userObject)
        res.status(201).send({ user })
    }
}

export { getUsers, postUser }