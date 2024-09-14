const { ServerApiVersion } = require('mongodb');
import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import dotenv from 'dotenv'

const ENV = process.env.NODE_ENV || "development"
const pathToEnvFile = `${__dirname}/.env.${ENV}`;

dotenv.config({
  path: pathToEnvFile
});

const getClient = async () => {  
  if (ENV === "test") {
    // global instance created to allow reuse
    const instance: MongoMemoryServer = await MongoMemoryServer.create();
    process.env.URI = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
  }
  
  if (!process.env.URI) {
    throw new Error("URI not set")
  }

  const client: MongoClient = new MongoClient(process.env.URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  await client.connect()
  const db: Db = client.db("gym-app");
  return db
}

const db = getClient()

export default db