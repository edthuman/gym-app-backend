import { db } from "../../connection"

const selectAllUsers = async () => {
    const usersArray = [];
    const usersCluster = (await db).collection("users").find({});
    for await (const user of usersCluster) {
        usersArray.push(user)
    }
    return usersArray
}

export { selectAllUsers }