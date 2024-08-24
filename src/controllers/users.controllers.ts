import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError } from "../error-handlers"

const getUsers = async (req: Request, res: Response) => {
    const users = await selectAllUsers()
    res.send({ users })
}

const postUser = async (req: Request, res: Response) => {
    const userObject = req.body
    const {username} = req.body
    const userProperties = Object.keys(userObject).length

    if (userProperties === 0) {
        sendBadRequestError(res, "No request body given")
    } else if (username === undefined || username === "") {
        sendBadRequestError(res, "No username given")
    } else if (userProperties > 1) {
        sendBadRequestError(res, "Request body should only provide a username")
    } else {
        const user = await insertUser(userObject)
        res.status(201).send({ user })
    }
}

export { getUsers, postUser }