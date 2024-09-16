import { MongoClient } from "mongodb";
import db from "../connection";
import seed from "../src/seeding/seed";
import { MongoMemoryServer } from "mongodb-memory-server";

const { users, exercises, diaries } = require("../src/seeding/data/test-data")

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