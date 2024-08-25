const { ServerApiVersion } = require('mongodb');
import { Db, MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { uri } from "./uri";

const getClient = async () => {
  let uriToUse
  if (process.env.NODE_ENV === "test") {
    // global instance created to allow reuse
    const instance: MongoMemoryServer = await MongoMemoryServer.create();
    uriToUse = instance.getUri();
    (global as any).__MONGOINSTANCE = instance;
  } else {
    uriToUse = uri
  }
  
  const client: MongoClient = new MongoClient(uriToUse, {
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