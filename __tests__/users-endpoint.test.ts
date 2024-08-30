import app from "../src";
import request from 'supertest';
import { MongoDBUser } from "../src/types";
import db from "../connection";

describe("/users", () => {
    describe("/", () => {
        test("GET 200: returns a list of all users", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body: { users }}) => {
                expect(users).toHaveLength(4)

                users.forEach((user: MongoDBUser) => {                        
                    expect(user).toEqual({
                        _id: expect.any(String),
                        username: expect.any(String)
                    })
                })
            })
        })
        test("POST 201: posts and returns a given user", () => {
            const userObject = { username: "givenUser"}
            
            return request(app)
            .post("/api/users")
            .send(userObject)
            .expect(201)
            .then(({body: { user }}) => {
                expect(user).toEqual({
                    _id: expect.any(String),
                    username: expect.stringMatching(userObject.username)
                })
            })
        })
        test("POST 400: returns a Bad Request error message if provided no body", () => {
            return request(app)
            .post("/api/users")
            .expect(400)
            .then(({body: { msg }}) => {
                expect(msg).toBe("No request body given")
            })
        })
        test("POST 400: returns a Bad Request error message if no username property on body", () => {
            const noUsernameObject = {"key": "value"}
            
            return request(app)
            .post("/api/users")
            .send(noUsernameObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No username given")
            })
        })
        test("POST 400: returns a Bad Request error message if given username is an empty string", () => {
            const emptyStringUsername = { username: "" }
            
            return request(app)
            .post("/api/users")
            .send(emptyStringUsername)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No username given")
            })
        })
        test("POST 400: returns a Bad Request error message if given username is not a string", () => {
            const nonStringUsername = { username: [ "username" ] }
            
            return request(app)
            .post("/api/users")
            .send(nonStringUsername)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Username must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message if body has extra properties", () => {
            const user = { username : "valid-name", extraProp: "not needed"}
            
            return request(app)
            .post("/api/users")
            .send(user)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request body should only provide a username")
            })
        })
        test("POST 409: returns a Conflict error message if username already exists", () => {
            const duplicateUser = { username: "gymbro" } // exists in seed data
            
            return request(app)
            .post("/api/users")
            .send(duplicateUser)
            .expect(409)
            .then(({body: {msg}}) => {
                expect(msg).toBe("A user already exists with given username")
            })
        })
        test("PATCH 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .patch("/api/users")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("DELETE 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .delete("/api/users")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("PUT 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .put("/api/users")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
    })
    describe("?",() => {
        describe("sort", () => {
            test("GET 200: returns users ordered by username when given no input", () => {
                return request(app)
                .get("/api/users?sort")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a.username.toLowerCase()
                        const y = b.username.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by username when queried with username", () => {
                return request(app)
                .get("/api/users?sort=username")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a.username.toLowerCase()
                        const y = b.username.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by _id when queried with id", () => {
                return request(app)
                .get("/api/users?sort=id")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by _id when queried with _id", () => {
                return request(app)
                .get("/api/users?sort=_id")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 400: returns a Bad Request error message when given invalid sort criteria", () => {
                return request(app)
                .get("/api/users?sort=random")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid sort query")
                })
            })
            test("POST 400: returns a Bad Request error message when given a sort query", () => {
                return request(app)
                .post("/api/users?sort=id")
                .send({username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when given an empty sort query", () => {
                return request(app)
                .post("/api/users?sort")
                .send({username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
        describe("order", () => {
            test("GET 200: returns users ordered by ascending _id when given no input", () => {
                return request(app)
                .get("/api/users?order")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by ascending _id when passed ASC", () => {
                return request(app)
                .get("/api/users?order=ASC")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by ascending _id when passed asc", () => {
                return request(app)
                .get("/api/users?order=asc")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by ascending _id when passed 'ascending'", () => {
                return request(app)
                .get("/api/users?order=ascending")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by descending _id when passed DESC", () => {
                return request(app)
                .get("/api/users?order=DESC")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x > y) return -1
                        if (x < y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by descending _id when passed desc", () => {
                return request(app)
                .get("/api/users?order=desc")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x > y) return -1
                        if (x < y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 200: returns users ordered by descending _id when passed 'descending'", () => {
                return request(app)
                .get("/api/users?order=descending")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a._id.toLowerCase()
                        const y = b._id.toLowerCase()
                        if (x > y) return -1
                        if (x < y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 400: returns a Bad Request error message when given invalid order criteria", () => {
                return request(app)
                .get("/api/users?order=random")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid order query")
                })
            })
            test("POST 400: returns a Bad Request error message when given an order query", () => {
                return request(app)
                .post("/api/users?order=asc")
                .send({username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when given an empty order query", () => {
                return request(app)
                .post("/api/users?order")
                .send({username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
        describe("sort & order", () => {
            test("GET 200: returns correct response when given both sort and order queries", () => {
                return request(app)
                .get("/api/users?sort=username&order=desc")
                .expect(200)
                .then(({body: {users}}) => {
                    const orderedUsers = users.toSorted((a: MongoDBUser, b: MongoDBUser)=>{
                        const x = a.username.toLowerCase()
                        const y = b.username.toLowerCase()
                        if (x > y) return -1
                        if (x < y) return 1
                        return 0
                    })
                    expect(users).toEqual(orderedUsers)
                })
            })
            test("GET 400: returns Bad Request error message when given invalid sort and order queries", () => {
                return request(app)
                .get("/api/users?sort=random&order=random")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid sort query")
                })
            })
            test("POST 400: returns a Bad Request error message when given an empty order query", () => {
                return request(app)
                .post("/api/users?sort=id&order=asc")
                .send({username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
        describe("username", () => {
            test("GET 200: returns the correct user in an array if given existing username", () => {
                return request(app)
                .get("/api/users?username=HumptyDumpty")
                .expect(200)
                .then(({body: {users}}) => {
                    expect(users).toEqual([{
                        _id: expect.any(String),
                        username: "HumptyDumpty"
                    }])
                })
            })
            test("GET 400: returns a Bad Request error message if passed no value for username", () => {
                return request(app)
                .get("/api/users?username")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No username given")
                })
            })
            test("GET 404: returns a Not Found error message for a non-existent username", () => {
                return request(app)
                .get("/api/users?username=not-real-user")
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No users found")
                })
            })
            test("POST 400: returns a Bad Request error message when using a username query on a post", () => {
                return request(app)
                .post("/api/users?username=name")
                .send({username: "validUser"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when using an empty username query on a post", () => {
                return request(app)
                .post("/api/users?username")
                .send({username: "validUser"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
        describe("non-existent queries", () => {
            test("GET 400: returns a Bad Request error message if given an invalid query", () => {
                return request(app)
                .get("/api/users?query=invalid")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("GET 400: returns a Bad Request error message if given an empty invalid query", () => {
                return request(app)
                .get("/api/users?query")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message if given an invalid query", () => {
                return request(app)
                .post("/api/users?query=invalid")
                .send({ username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message if given an empty invalid query", () => {
                return request(app)
                .post("/api/users?query")
                .send({ username: "valid-username"})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
    })
    describe("/users/:user_id", () => {
        test("GET 200: returns the correct user when given a valid id", async () => {
            const gymbro = await (await db).collection("users").findOne({username: "gymbro"}) || { _id: "" }

            return request(app)
            .get(`/api/users/${gymbro._id.toString()}`)
            .expect(200)
            .then(({body: {user}}) => {
                expect(user).toEqual({
                    username: "gymbro",
                    exercises: [
                        "Pull Up",
                        "Treadmill"
                    ]
                })
            })
        })
        test("GET 400: returns a Bad Request error message when the given user_id is too short", () => {
            return request(app)
            .get("/api/users/aaaaa11111bbbbb22222ccc")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid user id")
            })
        })
        test("GET 400: returns a Bad Request error message when the given user_id is too long", () => {
            return request(app)
            .get("/api/users/aaaaa11111bbbbb22222ccccc")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid user id")
            })
        })
        test("GET 404: returns a Not Found error message when no user exists for the given id", () => {
            return request(app)
            .get("/api/users/111111111111111111111111")
            .expect(404)
            .then(({body: {msg}}) => {
                expect(msg).toBe("User not found")
            })
        })
        test("POST 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .post("/api/users/abcde12345abcde12345abc")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("PATCH 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .patch("/api/users/abcde12345abcde12345abc")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("DELETE 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .delete("/api/users/abcde12345abcde12345abc")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("PUT 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .put("/api/users/abcde12345abcde12345abc")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        describe("?", () => {
            test("GET 400: returns a Bad Request error message if passed a query", () => {
                return request(app)
                .get("/api/users/aaaaa11111bbbbb22222cccc?query=this")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("GET 400: returns a Bad Request error message if passed an empty query", () => {
                return request(app)
                .get("/api/users/aaaaa11111bbbbb22222cccc?query")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
    })
})