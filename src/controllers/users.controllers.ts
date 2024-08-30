import { Request, Response } from "express"
import { insertUser, selectAllUsers, selectUserById, selectUserByUsername } from "../models/users.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendNotFoundError } from "../error-handlers"
import { getUserErrorMessage, sortUsers } from "../utils/user.utils"
import { ObjectId } from "mongodb"

export const getAllUsers = async (req: Request, res: Response) => {
    const { sort, order, username } = req.query
    
    const validSortCriteria: any[] = ["username", "id", "_id", "", undefined]
    const isInvalidSortCriteria = !validSortCriteria.includes(sort)
    
    const validOrderCriteria: any[] = ["DESC", "desc", "descending", "ASC", "asc", "ascending", "", undefined]
    const isInvalidOrderCriteria = !validOrderCriteria.includes(order)
    
    if (username === "") {
        sendBadRequestError(res, "No username given")
        return
    }
    if (username) {
        const user = await selectUserByUsername(username)
        if (user === null) {
            sendNotFoundError(res, "No users found")
            return
        }
        if (user.error) {
            sendInternalServerError(res, "Error fetching users")
            return
        }

        delete user.exercises
        res.send({users: [user]})
        return
    }

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
    const {username} = req.query
    if (typeof username === "string") {
        sendBadRequestError(res, "Invalid query")
        return
    }

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

    let id: ObjectId
    try {
        id = new ObjectId(user_id)
    }
    catch {
        sendBadRequestError(res, "Invalid user id")
        return
    }
    
    const user: any = await selectUserById(id)
    if (user === null) {
        sendNotFoundError(res, "User not found")
        return
    }
    if (user.error) {
        sendInternalServerError(res, "Error fetching user")
        return
    }
    
    delete user._id
    res.send({ user })
}