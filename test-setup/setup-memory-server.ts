import { MongoClient } from "mongodb";
import { db } from "../connection";
import seed from "../src/seed/seed";
const users = require("../src/seed/data/users.json")

beforeAll(async () => {
    await seed(await db, users);
})

afterAll(async () => {
    // declare db as any type to allow access to client
    const database: any = (await db)
    const client: MongoClient = database.client
    client.close()
})