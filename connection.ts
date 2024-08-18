const { ServerApiVersion } = require('mongodb');
import { MongoClient } from "mongodb";
import { uri } from "./uri";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const getClient = async () => {
  await client.connect()
  const db = client.db("gym-app");
  return db
}

export default getClient