import { MongoDBUser } from "../src/types";
import { getUserErrorMessage, sortUsers } from "../src/utils/user.utils";

describe("getUserErrorMessage", () => {
    it("returns an empty string if provided a valid user object", () => {
        const user = { username: "Jeff"}
        
        const output = getUserErrorMessage(user)

        expect(output).toBe("")
    })
    it("returns correct error message if user object is empty", () => {
        const user = {}
        
        const output = getUserErrorMessage(user)

        expect(output).toBe("No request body given")
    })
    it("returns correct error message if user object has no username", () => {
        const user = { key: "value"}
        
        const output = getUserErrorMessage(user)

        expect(output).toBe("No username given")
    })
    it("returns correct error message if username is an empty string", () => {
        const user = { username: ""}
        
        const output = getUserErrorMessage(user)

        expect(output).toBe("No username given")
    })
    it("returns correct error message if username is not a string", () => {
        const numberUsername = { username: 3}
        const numberUsernameOutput = getUserErrorMessage(numberUsername)
        expect(numberUsernameOutput).toBe("Username must be a string")

        const arrayUsername = { username: ["username"]}
        const arrayUsernameOutput = getUserErrorMessage(arrayUsername)
        expect(arrayUsernameOutput).toBe("Username must be a string")

        const objectUsername = { username: {username: "username"}}
        const objectUsernameOutput = getUserErrorMessage(objectUsername)
        expect(objectUsernameOutput).toBe("Username must be a string")
    })
    it("returns correct error message if user object has extra properties", () => {
        const user = { username: "Jeff", age: 22}
        
        const output = getUserErrorMessage(user)

        expect(output).toBe("Request body should only provide a username")
    })
    // no need for a test checking user is an object, as this is req.body
})

describe("sortUsers", () => {
    const users = require("../src/seeding/data/users.json")

    it("returns user array sorted by ascending _id when given undefined sort and order", () => {
        const output = sortUsers(users, undefined, undefined)
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted by username when sort is 'username'", () => {
        const output = sortUsers(users, "username", undefined)
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a.username.toLowerCase()
            const y = b.username.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })

        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted by username when sort is an empty string", () => {
        const output = sortUsers(users, "", undefined)
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a.username.toLowerCase()
            const y = b.username.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })

        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted ascending when order is 'ASC'", () => {
        const output = sortUsers(users, undefined, "ASC")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted ascending when order is 'asc'", () => {
        const output = sortUsers(users, undefined, "asc")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted ascending when order is 'ascending'", () => {
        const output = sortUsers(users, undefined, "ascending")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted ascending when order is an empty string", () => {
        const output = sortUsers(users, undefined, "")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted descending when order is 'DESC'", () => {
        const output = sortUsers(users, undefined, "DESC")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted descending when order is 'desc'", () => {
        const output = sortUsers(users, undefined, "desc")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns user array sorted descending when order is 'descending'", () => {
        const output = sortUsers(users, undefined, "descending")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
    it("returns correctly sorted array when passed both sort and order criteria", () => {
        const output = sortUsers(users, "username", "descending")
        
        const expectedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser) => {
            const x = a.username.toLowerCase()
            const y = b.username.toLowerCase()
            if (x < y) return 1
            if (x > y) return -1
            return 0
        })
        expect(output).toEqual(expectedUsers)
    })
})