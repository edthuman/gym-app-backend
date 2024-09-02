import { MongoDBUser } from "../src/types";
import { checkUserOrder, checkUserSort, findInvalidUserQueries, getUserErrorMessage, sortUsers } from "../src/utils/user.utils";

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
    it("returns a new array", () => {
        const output = sortUsers(users, "id", "desc")

        expect(output).not.toBe(users)
    })
    it("does not mutate the original array", () => {
        const users = [
            { _id: "1", username: "A"},
            { _id: "1", username: "B"}
        ]
        const usersCopy = [
            { _id: "1", username: "A"},
            { _id: "1", username: "B"}
        ]

        sortUsers(users, "username", "desc")
        expect(users).toEqual(usersCopy)
    })
})

describe("findInvalidUserQueries", () => {
    test("returns false when given one valid query", () => {
        const output = findInvalidUserQueries(["sort"])
        expect(output).toBe(false)
    })
    test("returns false when given two valid queries", () => {
        const output = findInvalidUserQueries(["order", "username"])
        expect(output).toBe(false)
    })
    test("returns false when given three valid queries", () => {
        const output = findInvalidUserQueries(["order", "sort", "username"])
        expect(output).toBe(false)
    })
    test("returns true when given an invalid query", () => {
        const output = findInvalidUserQueries(["random"])
        expect(output).toBe(true)
    })
    test("returns true when given multiple invalid queries", () => {
        const output = findInvalidUserQueries(["random", "yes", "no"])
        expect(output).toBe(true)
    })
    test("returns true when given a mixture of valid and invalid queries", () => {
        const output = findInvalidUserQueries(["sort", "order", "random"])
        expect(output).toBe(true)
    })
})

describe("checkUserSort", () => {
    test("returns false when passed username", () => {
        const output = checkUserSort("username")
        expect(output).toBe(false)
    })
    test("returns false when passed id", () => {
        const output = checkUserSort("id")
        expect(output).toBe(false)
    })
    test("returns false when passed _id", () => {
        const output = checkUserSort("_id")
        expect(output).toBe(false)
    })
    test("returns false when passed an empty string", () => {
        const output = checkUserSort("")
        expect(output).toBe(false)
    })
    test("returns false when passed undefined", () => {
        const output = checkUserSort(undefined)
        expect(output).toBe(false)
    })
    test("returns true when passed an invalid sort string", () => {
        const output = checkUserSort("invalid sort")
        expect(output).toBe(true)
    })
    test("returns true when passed undefined as a string", () => {
        const output = checkUserSort("undefined")
        expect(output).toBe(true)
    })
    test("returns true when passed a number", () => {
        const output = checkUserSort(3)
        expect(output).toBe(true)
    })
    test("returns true when passed an array", () => {
        const output = checkUserSort(["username"])
        expect(output).toBe(true)
    })
    test("returns true when passed an object", () => {
        const output = checkUserSort({username: "username"})
        expect(output).toBe(true)
    })
})

describe("checkUserOrder", () => {
    test("returns false when passed desc", () => {
        const output = checkUserOrder("desc")
        expect(output).toBe(false)
    })
    test("returns false when passed DESC", () => {
        const output = checkUserOrder("DESC")
        expect(output).toBe(false)
    })
    test("returns false when passed descending", () => {
        const output = checkUserOrder("descending")
        expect(output).toBe(false)
    })
    test("returns false when passed asc", () => {
        const output = checkUserOrder("asc")
        expect(output).toBe(false)
    })
    test("returns false when passed ASC", () => {
        const output = checkUserOrder("ASC")
        expect(output).toBe(false)
    })
    test("returns false when passed ascending", () => {
        const output = checkUserOrder("ascending")
        expect(output).toBe(false)
    })
    test("returns false when passed an empty string", () => {
        const output = checkUserOrder("")
        expect(output).toBe(false)
    })
    test("returns false when passed undefined", () => {
        const output = checkUserOrder(undefined)
        expect(output).toBe(false)
    })
    test("returns true when passed an invalid order string", () => {
        const output = checkUserOrder("invalid order")
        expect(output).toBe(true)
    })
    test("returns true when passed undefined as a string", () => {
        const output = checkUserOrder("undefined")
        expect(output).toBe(true)
    })
    test("returns true when passed a number", () => {
        const output = checkUserOrder(3)
        expect(output).toBe(true)
    })
    test("returns true when passed an array", () => {
        const output = checkUserOrder(["desc"])
        expect(output).toBe(true)
    })
    test("returns true when passed an object", () => {
        const output = checkUserOrder({ order: "asc"})
        expect(output).toBe(true)
    })
})