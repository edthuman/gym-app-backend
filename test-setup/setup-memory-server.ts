import { MongoClient } from "mongodb";
import db from "../connection";
import seed from "../src/seeding/seed";
import { MongoMemoryServer } from "mongodb-memory-server";

const users = require("../src/seeding/data/users.json");
const exercises = require("../src/seeding/data/exercises.json");
const diaries = require("../src/seeding/data/diaries.json")

beforeAll(async () => {
    await seed(await db, users, exercises, diaries);
})

afterAll(async () => {
    // declare db as any type to allow access to client
    const database: any = (await db)
    const client: MongoClient = database.client
    client.close()

    const memoryServer: MongoMemoryServer = (global as any).__MONGOINSTANCE;
    memoryServer.stop()
})