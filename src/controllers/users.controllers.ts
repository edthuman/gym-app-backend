import { Request, Response } from "express"
import { selectAllUsers } from "../models/users.models"

const getUsers = async (req: Request, res: Response) => {
    const users = await selectAllUsers()
    res.send({ users })
}

export { getUsers }