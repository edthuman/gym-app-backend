import app from "../src";
import request from 'supertest';
import { MongoDBUser } from "../src/types";

const endpoints = require("../endpoints.json")

describe("/api", ()=>{
    describe("/", ()=>{
        test("GET 200: returns the expected json file", () => {
            const expectedEndpoints = { endpoints }
    
            return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(expectedEndpoints)
            })
        })
        test("POST 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .post("/api")
            .expect(405)
            .then(({ body: { msg }}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("PATCH 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .patch("/api")
            .expect(405)
            .then(({ body : { msg }}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("DELETE 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .delete("/api")
            .expect(405)
            .then(({ body : { msg }}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("PUT 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .put("/api")
            .expect(405)
            .then(({ body : { msg }}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
    })
    describe("/users", () => {
        test("GET 200: returns a list of all users", () => {
            return request(app)
            .get("/api/users")
            .expect(200)
            .then(({body: { users }}) => {
                expect(users).toHaveLength(4)

                users.forEach((user: any) => {
                    const numberOfProperties = Object.keys(user).length

                    expect(numberOfProperties).toBe(2)
                    
                    expect(user).toMatchObject({
                        _id: expect.any(String),
                        username: expect.any(String)
                    })
                })
            })
        })
        test("POST 200: posts and returns a given user", () => {
            const userObject = { username: "givenUser"}
            
            return request(app)
            .post("/api/users")
            .send(userObject)
            .expect(201)
            .then(({body: { user }}) => {
                expect(user).toMatchObject({
                    _id: expect.any(String),
                    username: expect.stringMatching(userObject.username)
                })
            })
        })
        test("POST 400: returns an error message if provided no body", () => {
            return request(app)
            .post("/api/users")
            .expect(400)
            .then(({body: { msg }}) => {
                expect(msg).toBe("No request body given")
            })
        })
        test("POST 400: returns an error message if no username property on body", () => {
            const noUsernameObject = {"key": "value"}
            
            return request(app)
            .post("/api/users")
            .send(noUsernameObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No username given")
            })
        })
        test("POST 400: returns an error message if given username is an empty string", () => {
            const emptyStringUsername = { username: "" }
            
            return request(app)
            .post("/api/users")
            .send(emptyStringUsername)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No username given")
            })
        })
        test("POST 400: returns an error message if given username is not a string", () => {
            const nonStringUsername = { username: [ "username" ] }
            
            return request(app)
            .post("/api/users")
            .send(nonStringUsername)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Username must be a string")
            })
        })
        test("POST 400: returns an error message if body has extra properties", () => {
            const user = { username : "valid-name", extraProp: "not needed"}
            
            return request(app)
            .post("/api/users")
            .send(user)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request body should only provide a username")
            })
        })
        test("POST 409: returns an error message if username already exists", () => {
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
        describe("?",() => {
            describe("sort", () => {
                test("returns users ordered by username when given no input", () => {
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
                test("returns users ordered by username when queried with username", () => {
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
                test("returns users ordered by _id when queried with id", () => {
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
                test("returns users ordered by _id when queried with _id", () => {
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
            })
            describe("order", () => {
                test("returns users ordered by ascending _id when given no input", () => {
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
                test("returns users ordered by ascending _id when passed ASC", () => {
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
                test("returns users ordered by ascending _id when passed asc", () => {
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
                test("returns users ordered by ascending _id when passed 'ascending'", () => {
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

            })
        })
    })
})

describe("non-existent endpoints", () => {
    test("GET 404: returns a Not Found error message", () => {
        return request(app)
        .get("/endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Requested endpoint does not exist")
        })
    })
    test("POST 404: returns a Not Found error message", () => {
        return request(app)
        .post("/endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Requested endpoint does not exist")
        })
    })
    test("PATCH 404: returns a Not Found error message", () => {
        return request(app)
        .patch("/endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Requested endpoint does not exist")
        })
    })
    test("DELETE 404: returns a Not Found error message", () => {
        return request(app)
        .delete("/endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Requested endpoint does not exist")
        })
    })
    test("PUT 404: returns a Not Found error message", () => {
        return request(app)
        .put("/endpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe("Requested endpoint does not exist")
        })
    })
})