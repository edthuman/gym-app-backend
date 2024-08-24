import { db } from "../connection";
import seed from "../src/seed/seed";
const users = require("../src/seed/data/users.json")

beforeAll(async () => {
    await seed(await db, users);
})