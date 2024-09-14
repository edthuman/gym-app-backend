import { Request, Response } from "express"
import { insertUser, selectAllUsers, selectUserById, selectUserByUsername } from "../models/users.models"
import { sendBadRequestError, sendConflictError, sendInternalServerError, sendInvalidQueryError, sendInvalidSortError, sendNotFoundError } from "../error-handlers"
import { checkUserOrder, checkUserSort, findInvalidUserQueries, getUserError, sortUsers } from "../utils/user.utils"
import { ObjectId } from "mongodb"

export const getAllUsers = async (req: Request, res: Response) => {
    const queries = Object.keys(req.query)
    const isInvalidQuery = findInvalidUserQueries(queries)
    if (isInvalidQuery) {
        return sendInvalidQueryError(res)
    }

    const { sort, order, username } = req.query
    
    const isInvalidSort = checkUserSort(sort)
    if (isInvalidSort) {
        return sendInvalidSortError(res)
    }

    const isInvalidOrder = checkUserOrder(order)
    if (isInvalidOrder) {
        return sendBadRequestError(res, "Invalid order query")
    }
    
    if (Array.isArray(username)) {
        return sendBadRequestError(res, "Multiple username queries given")
    }

    if (username === "") {
        return sendBadRequestError(res, "No username given")
    }
    if (username) {
        return getUserByUsername(res, username)
    }

    const users = await selectAllUsers()

    const isServerError = users.length === 0
    if (isServerError) {
        return sendInternalServerError(res, "Error fetching users")
    }
    const sortedUsers = sortUsers(users, sort, order)
    res.send({ users: sortedUsers })
}

export const postUser = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        return sendInvalidQueryError(res)
    }

    const userObject = req.body
    const userError = getUserError(userObject)

    if (userError) {
        return sendBadRequestError(res, userError)
    }

    const user = await insertUser(userObject)    
    if (user.isDuplicateUser) {
        return sendConflictError(res, "A user already exists with given username")
    }
    if (user._id === undefined) {
        return sendInternalServerError(res, "Error posting user")
    }
    res.status(201).send({ user })
}

export const getUserById = async (req: Request, res: Response) => {
    const isQuery = Object.keys(req.query).length !== 0
    if (isQuery) {
        return sendInvalidQueryError(res)
    }

    const { user_id } = req.params

    let id: ObjectId
    try {
        id = new ObjectId(user_id)
    }
    catch {
        return sendBadRequestError(res, "Invalid user id")
    }
    
    const user: any = await selectUserById(id)
    if (user === null) {
        return sendNotFoundError(res, "User not found")
    }
    if (user.isError) {
        return sendInternalServerError(res, "Error fetching user")
    }
    
    delete user._id
    res.send({ user })
}

const getUserByUsername = async (res: Response, username: any) => {
    const user = await selectUserByUsername(username)
    if (user === null) {
        return sendNotFoundError(res, "No users found")
    }
    if (user.isError) {
        return sendInternalServerError(res, "Error fetching users")
    }

    delete user.exercises
    res.send({users: [user]})
}