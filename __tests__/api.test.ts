import app from "../src";
import request from 'supertest';
import { MongoDBExercise, MongoDBUser } from "../src/types";
import db from "../connection";

const endpoints = require("../endpoints.json")

describe("/api", () => {
    describe("/", () => {
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
            })
        })
        describe.only("/users/:user_id", () => {
            test("GET 200: returns the correct user when given a valid username", async () => {
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
        })
    })
    describe("/exercises", () => {
        describe("/", () => {
            test("GET 200: returns an array of all exercises", () => {
                return request(app)
                .get("/api/exercises")
                .expect(200)
                .then(({body: {exercises}}) => {
                    expect(exercises).toHaveLength(6)

                    exercises.forEach((exercise: MongoDBExercise[]) => {
                        expect(exercise).toEqual({
                            _id: expect.any(String),
                            name: expect.any(String),
                            description: expect.any(String),
                            icon: expect.any(String)
                        })
                    })
                })
            })
            test("POST 201: returns the posted exercise object", () => {
                const exerciseObject = {
                    name: "Star Jump",
                    description: "Jump up and down quickly, opening and closing your arms and legs in synch with your jumps",
                    icon: "star"
                }
                
                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(201)
                .then(({body: {exercise}}) => {
                    expect(exercise).toEqual({
                        _id: expect.any(String),
                        name: "Star Jump",
                        description: "Jump up and down quickly, opening and closing your arms and legs in synch with your jumps",
                        icon: "star"
                    })
                })
            })
            test("POST 400: returns a Bad Request error message when given no exercise object", () => {
                return request(app)
                .post("/api/exercises")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No request body given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an empty exercise object", () => {
                return request(app)
                .post("/api/exercises")
                .send({})
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No request body given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with no name", () => {
                const exerciseObject = { description: "description", icon: "icon" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No name given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with an empty string name", () => {
                const exerciseObject = { name: "", description: "description", icon: "icon" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No name given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with a non-string name", () => {
                const exerciseObject = { name: [], description: "description", icon: "icon" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Name must be a string")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with no description", () => {
                const exerciseObject = { name: "name", icon: "icon" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No description given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with an empty string description", () => {
                const exerciseObject = { name: "name", description: "", icon: "icon" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No description given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with a non-string description", () => {
                const exerciseObject = { name: "name", description: {}, icon: "icon" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Description must be a string")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with no icon", () => {
                const exerciseObject = { name: "name", description: "description" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No icon given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with an empty string icon", () => {
                const exerciseObject = { name: "name", description: "description", icon: "" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No icon given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object with a non-string icon", () => {
                const exerciseObject = { name: "name", description: "description", icon: 3 }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Icon must be a string")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object missing multiple properties", () => {
                const exerciseObject = { name: "name" }

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No description given")
                })
            })
            test("POST 400: returns a Bad Request error message when given an object missing multiple properties", () => {
                const exerciseObject = { name: "name", description: "description", icon: "icon", extraProperty: "value"}

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Request body should only include name, description, and icon")
                })
            })
            test("POST 400: returns a Bad Request error message when given a duplicate exercise name", () => {
                const exerciseObject = { name: "Treadmill", description: "description", icon: "icon"}

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("An exercise already exists with that name")
                })
            })
            test("POST 400: returns a Bad Request error message when given a duplicate exercise name with different casing", () => {
                const exerciseObject = { name: "treadmill", description: "description", icon: "icon"}

                return request(app)
                .post("/api/exercises")
                .send(exerciseObject)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("An exercise already exists with that name")
                })
            })
            test("PATCH 405: returns a Method Not Allowed error message", () => {
                return request(app)
                .patch("/api/exercises")
                .expect(405)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Request method not allowed on this endpoint")
                })
            })
            test("DELETE 405: returns a Method Not Allowed error message", () => {
                return request(app)
                .delete("/api/exercises")
                .expect(405)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Request method not allowed on this endpoint")
                })
            })
            test("PUT 405: returns a Method Not Allowed error message", () => {
                return request(app)
                .put("/api/exercises")
                .expect(405)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Request method not allowed on this endpoint")
                })
            })
        })
        describe("?", () => {
            describe("sort", () => {
                test("GET 200: returns exercises sorted by name when query has no value", () => {
                    return request(app)
                    .get("/api/exercises?sort")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a.name.toLowerCase()
                            const y =b.name.toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by _id when query is id", () => {
                    return request(app)
                    .get("/api/exercises?sort=id")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y =b._id.toString().toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by _id when query is _id", () => {
                    return request(app)
                    .get("/api/exercises?sort=_id")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y =b._id.toString().toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by name when query is name", () => {
                    return request(app)
                    .get("/api/exercises?sort=name")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a.name.toLowerCase()
                            const y =b.name.toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })
                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 400: returns a Bad Request error message when sort criteria is invalid", () => {
                    return request(app)
                    .get("/api/exercises?sort=random")
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe("Invalid sort query")
                    })
                })
            })
            describe("order", () => {
                test("GET 200: returns exercises sorted by ascending _id when query has no value", () => {
                    return request(app)
                    .get("/api/exercises?order")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by ascending _id when query is 'asc'", () => {
                    return request(app)
                    .get("/api/exercises?order=asc")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by ascending _id when query is 'ASC'", () => {
                    return request(app)
                    .get("/api/exercises?order=ASC")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by ascending _id when query is 'ascending", () => {
                    return request(app)
                    .get("/api/exercises?order=ascending")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return -1
                            if (x > y) return 1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by descending _id when query is 'desc'", () => {
                    return request(app)
                    .get("/api/exercises?order=desc")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return 1
                            if (x > y) return -1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by descending _id when query is 'DESC'", () => {
                    return request(app)
                    .get("/api/exercises?order=DESC")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return 1
                            if (x > y) return -1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 200: returns exercises sorted by descending _id when query is 'descending'", () => {
                    return request(app)
                    .get("/api/exercises?order=descending")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                            const x = a._id.toString().toLowerCase()
                            const y = b._id.toString().toLowerCase()
                            if (x < y) return 1
                            if (x > y) return -1
                            return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 400: returns a Bad Request error message when query is invalid", () => {
                    return request(app)
                    .get("/api/exercises?order=random")
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toBe("Invalid order query")
                    })
                })
            })
            describe("sort & order", () => {
                test("GET 200: returns correctly sorted exercises when given both sort and order queries", () => {
                    return request(app)
                    .get("/api/exercises?sort=name&order=desc")
                    .expect(200)
                    .then(({body: {exercises}}) => {
                        const orderedExercises = exercises.toSorted((a: MongoDBExercise, b: MongoDBExercise) => {
                           const x = a.name.toLowerCase()
                           const y = b.name.toLowerCase()
                           if (x < y) return 1
                           if (x > y) return -1
                           return 0
                        })

                        expect(exercises).toEqual(orderedExercises)
                    })
                })
                test("GET 400: returns Bad Request error message when given invalid sort and invalid order", () => {
                    return request(app)
                    .get("/api/exercises?sort=random&order=random")
                    .expect(400)
                    .then(({body: {msg}}) => {
                        expect(msg).toEqual("Invalid sort query")
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