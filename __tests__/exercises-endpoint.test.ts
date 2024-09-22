import app from "../src";
import request from 'supertest';
import { MongoDBExercise } from "../src/types";

describe("api/exercises", () => {
    describe("/", () => {
        test("GET 200: returns an array of all exercises", () => {
            return request(app)
            .get("/api/exercises")
            .expect(200)
            .then(({body: {exercises}}) => {
                expect(exercises).toHaveLength(6)

                exercises.forEach((exercise: any) => {
                    expect(exercise).toEqual({
                        _id: expect.any(String),
                        name: expect.any(String),
                        description: expect.any(String),
                        category: expect.any(String),
                        icon: expect.any(String)
                    })
                })
            })
        })
        test("POST 201: returns the posted exercise object", () => {
            const exerciseObject = {
                name: "Star Jump",
                description: "Jump up and down quickly, opening and closing your arms and legs in synch with your jumps",
                category: "Cardio",
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
                    category: "Cardio",
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
            const exerciseObject = { description: "description", category: "category", icon: "icon" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No name given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with an empty string name", () => {
            const exerciseObject = { name: "", description: "description", category: "category", icon: "icon" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No name given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with a non-string name", () => {
            const exerciseObject = { name: [], description: "description", category: "category", icon: "icon" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Name must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with no description", () => {
            const exerciseObject = { name: "name", category: "category", icon: "icon" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No description given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with an empty string description", () => {
            const exerciseObject = { name: "name", description: "", category: "category", icon: "icon" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No description given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with a non-string description", () => {
            const exerciseObject = { name: "name", description: {}, category: "category", icon: "icon" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Description must be a string")
            })
        })
        
        test("POST 400: returns a Bad Request error message when given an object with no icon", () => {
            const exerciseObject = { name: "name", description: "description", category: "category" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No icon given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with an empty string icon", () => {
            const exerciseObject = { name: "name", description: "description", category: "category", icon: "" }

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("No icon given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object with a non-string icon", () => {
            const exerciseObject = { name: "name", description: "description", category: "category", icon: 3 }

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
        test("POST 400: returns a Bad Request error message when given an object with an invalid property", () => {
            const exerciseObject = { name: "name", description: "description", category: "category", icon: "icon", extraProperty: "value"}

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request body should only include name, description, category, and icon")
            })
        })
        test("POST 409: returns a Conflict error message when given a duplicate exercise name", () => {
            const exerciseObject = { name: "Treadmill", description: "description", category: "category", icon: "icon"}

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(409)
            .then(({body: {msg}}) => {
                expect(msg).toBe("An exercise already exists with that name")
            })
        })
        test("POST 409: returns a Conflict error message when given a duplicate exercise name with different casing", () => {
            const exerciseObject = { name: "treadmill", description: "description", category: "category", icon: "icon"}

            return request(app)
            .post("/api/exercises")
            .send(exerciseObject)
            .expect(409)
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
            test("POST 400: returns a Bad Request error message when passed a sort query", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}
                
                return request(app)
                .post("/api/exercises?sort=id")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when passed an empty sort query", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}
                
                return request(app)
                .post("/api/exercises?sort")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
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
            test("POST 400: returns a Bad Request error message when passed an order query", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}
                
                return request(app)
                .post("/api/exercises?order=desc")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when passed an empty order query", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}
                
                return request(app)
                .post("/api/exercises?order")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
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
            test("GET 400: returns a Bad Request error message when given invalid sort and invalid order", () => {
                return request(app)
                .get("/api/exercises?sort=random&order=random")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toEqual("Invalid sort query")
                })
            })
            test("POST 400: returns a Bad Request error message when passed both order and sort queries", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}
                
                return request(app)
                .post("/api/exercises?sort=id&order=desc")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
        describe("name", () => {
            test("GET 200: returns an array with only the exercise with given name", () => {
                return request(app)
                .get("/api/exercises?name=Treadmill")
                .expect(200)
                .then(({body: {exercises}}) => {
                    expect(exercises).toEqual([
                        {
                        _id: expect.any(String),
                        name: "Treadmill",
                        description: "Walk or run on the machine",
                        category: "Cardio",
                        icon: "treadmill"
                        }
                    ])
                })
            })
            test("GET 200: returns an array with only the exercise with given name when name includes a space", () => {
                return request(app)
                .get("/api/exercises?name=Stair Machine")
                .expect(200)
                .then(({body: {exercises}}) => {
                    expect(exercises).toEqual([
                        {
                        _id: expect.any(String),
                        name: "Stair Machine",
                        description: "Climb stairs continuously",
                        category: "Cardio",
                        icon: "stairs"
                        }
                    ])
                })
            })
            test("GET 400: returns a Bad Request error message when name has no value", () => {
                return request(app)
                .get("/api/exercises?name")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No name given")
                })
            })
            test("GET 400: returns a Bad Request error message when given two name queries", () => {
                return request(app)
                .get("/api/exercises?name=Treadmill&name=Leg Press")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Multiple name queries given")
                })
            })
            test("GET 404: returns a Not Found error message when no exercise exists with given name", () => {
                return request(app)
                .get("/api/exercises?name=Rugby")
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No exercises found")
                })
            })
            test("POST 400: returns a Bad Request error message when given a name query on a post request", () => {
                const exercise = {name: "Dancing", description: "moving your body in time to music", icon: "dance"}
                return request(app)
                .post("/api/exercises?name=Dancing")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when given an empty name query on a post request", () => {
                const exercise = {name: "Dancing", description: "moving your body in time to music", icon: "dance"}
                return request(app)
                .post("/api/exercises?name")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 404: returns a Not Found error message when name matches part of an existing exercise name", () => {
                return request(app)
                .get("/api/exercises?name=Rowing")
                .expect(404)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("No exercises found")
                })
            }) 
        })
        describe("non-existent queries", () => {
            test("GET 400: returns a Bad Request error message when given invalid query", () => {
                return request(app)
                .get("/api/exercises?query=this")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("GET 400: returns a Bad Request error message when given empty invalid query", () => {
                return request(app)
                .get("/api/exercises?query")
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when given invalid query", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}

                return request(app)
                .post("/api/exercises?query=this")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
            test("POST 400: returns a Bad Request error message when given empty invalid query", () => {
                const exercise = { name: "Skipping", description: "skipping with a rope", icon: "skip-rope"}

                return request(app)
                .post("/api/exercises?query")
                .send(exercise)
                .expect(400)
                .then(({body: {msg}}) => {
                    expect(msg).toBe("Invalid query")
                })
            })
        })
    })
})