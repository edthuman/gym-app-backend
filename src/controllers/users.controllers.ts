import { Request, Response } from "express"
import { insertUser, selectAllUsers, selectUserById, selectUserByUsername } from "../models/users.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidQueryError, sendInvalidSortError, sendNotFoundError } from "../error-handlers"
import { checkUserOrder, checkUserSort, findInvalidUserQueries, getUserErrorMessage, sortUsers } from "../utils/user.utils"
import { ObjectId } from "mongodb"

export const getAllUsers = async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    const isInvalidQuery = findInvalidUserQueries(queries)
    if (isInvalidQuery) {
        sendInvalidQueryError(res)
        return
    }

    const { sort, order, username } = req.query
    
    const isInvalidSort = checkUserSort(sort)
    if (isInvalidSort) {
        sendInvalidSortError(res)
        return
    }

    const isInvalidOrder = checkUserOrder(order)
    if (isInvalidOrder) {
        sendBadRequestError(res, "Invalid order query")
        return
    }
    
    if (username === "") {
        sendBadRequestError(res, "No username given")
        return
    }
    if (username) {
        getUserByUsername(res, username)
        return
    }

    const users = await selectAllUsers()

    const isServerError = users.length === 0
    if (isServerError) {
        sendInternalServerError(res, "Error fetching users")
        return
    }
    const sortedUsers = sortUsers(users, sort, order)
    res.send({ users: sortedUsers })
}

export const postUser = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        sendInvalidQueryError(res)
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
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        sendInvalidQueryError(res)
        return
    }

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
    if (user.isError) {
        sendInternalServerError(res, "Error fetching user")
        return
    }
    
    delete user._id
    res.send({ user })
}

const getUserByUsername = async (res: Response, username: any) => {
    const user = await selectUserByUsername(username)
    if (user === null) {
        sendNotFoundError(res, "No users found")
        return
    }
    if (user.isError) {
        sendInternalServerError(res, "Error fetching users")
        return
    }

    delete user.exercises
    res.send({users: [user]})
    return
}