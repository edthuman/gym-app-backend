import { Request, Response } from "express"
import { insertUser, selectAllUsers, selectUserById } from "../models/users.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError } from "../error-handlers"
import { getUserErrorMessage, sortUsers } from "../utils/user.utils"

export const getAllUsers = async (req: Request, res: Response) => {
    const { sort, order } = req.query
    
    const validSortCriteria: any[] = ["username", "id", "_id", "", undefined]
    const isInvalidSortCriteria = !validSortCriteria.includes(sort)
    
    const validOrderCriteria: any[] = ["DESC", "desc", "descending", "ASC", "asc", "ascending", "", undefined]
    const isInvalidOrderCriteria = !validOrderCriteria.includes(order)
    
    const users = await selectAllUsers()

    const isServerError = users.length === 0
    if (isServerError) {
        sendInternalServerError(res, "Error fetching users")
        return
    }
    if (isInvalidSortCriteria) {
        sendBadRequestError(res, "Invalid sort query")
        return
    }
    if (isInvalidOrderCriteria) {
        sendBadRequestError(res, "Invalid order query")
        return
    }
    const sortedUsers = sortUsers(users, sort, order)
    res.send({ users: sortedUsers })
}

export const postUser = async (req: Request, res: Response) => {
    const userObject = req.body
    const userErrorMessage = getUserErrorMessage(userObject) // returns empty string if no error, else provides error message

    if (userErrorMessage) {
        sendBadRequestError(res, userErrorMessage)
        return
    }

    const user = await insertUser(userObject)    
    if (user.isDuplicateUser) {
        sendConflictError(res, "A user already exists with given username")
        return 
    }
    if (user._id === undefined) {
        sendInternalServerError(res, "Error posting user")
        return
    }
    res.status(201).send({ user })
}

export const getUserById = async (req: Request, res: Response) => {
    const { user_id } = req.params
    const user: any = await selectUserById(user_id)
    delete user._id

    res.send({ user })
}