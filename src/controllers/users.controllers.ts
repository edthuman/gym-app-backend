import { Request, Response } from "express"
import { insertUser, selectAllUsers } from "../models/users.models"
import { sendBadRequestError, sendConflictError } from "../error-handlers"
import { generateUserErrorMessage, sortUsers } from "../utils/user.utils"

export const getUsers = async (req: Request, res: Response) => {
    const { sort, order } = req.query
    
    const validSortCriteria: any[] = ["username", "id", "_id", "", undefined]
    const isInvalidSortCriteria = !validSortCriteria.includes(sort)
    
    const validOrderCriteria: any[] = ["DESC", "desc", "descending", "ASC", "asc", "ascending", "", undefined]
    const isInvalidOrderCriteria = !validOrderCriteria.includes(order)

    if (isInvalidSortCriteria) {
        sendBadRequestError(res, "Invalid sort criteria")
    } else if (isInvalidOrderCriteria) {
        sendBadRequestError(res, "Invalid order criteria")
    } else {
        const users = await selectAllUsers()
        const sortedUsers = sortUsers(users, sort, order)
        res.send({ users: sortedUsers })
    }
}

export const postUser = async (req: Request, res: Response) => {
    const userObject = req.body
    const userErrorMessage = generateUserErrorMessage(userObject) // returns empty string if no error, else provides error message

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