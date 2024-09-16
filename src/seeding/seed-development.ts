import { MongoClient } from "mongodb";
import db from "../../connection"
import seed from "./seed"

const { users, exercises, diaries } = require("./data/development-data") 

const seedDatabase = async () => {
    const database: any = (await db)    
    await seed(database, users, exercises, diaries);

    const client: MongoClient = database.client
    client.close()
}

seedDatabase()