import request from "supertest"
import app from "../src"
import { MongoDBDiary } from "../src/types"

describe("/api/diaries", () => {
    describe("/", () => {
        test("GET 200: returns an array of all diaries", () => {
            return request(app)
            .get("/api/diaries")
            .expect(200)
            .then(({body: {diaries}}) => {
                expect(diaries).toHaveLength(6)

                diaries.forEach((diary: any)=>{ 
                    expect(diary).toMatchObject({
                        _id: expect.any(String),
                        username: expect.any(String),
                        exercise: expect.any(String),
                        logs: expect.any(Array)
                    })

                    diary.logs.forEach((element: any) => {
                        expect(element).toEqual({
                            date: expect.stringMatching(/\d\d-\d\d-\d\d\d\d/),
                            log: expect.any(Number)
                        })
                    })
                })
            })
        })
        test("POST 201: returns the posted diary object", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(201)
            .then(({body: {diary}}) => {
                expect(diary).toEqual({
                    _id: expect.any(String),
                    username: "gymbro",
                    exercise: "Leg Press",
                    personalBest: 22.5,
                    goal: 40,
                    logs: []
                })
            })
        })
        test("POST 201: returns the posted diary object when given no log array", () => {
            const diary = {
                username: "liftqueen",
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(201)
            .then(({body: {diary}}) => {
                expect(diary).toEqual({
                    _id: expect.any(String),
                    username: "liftqueen",
                    exercise: "Leg Press",
                    personalBest: 22.5,
                    goal: 40,
                    logs: []
                })
            })
        })
        test("POST 201: returns the posted diary object when given no goal", () => {
            const diary = {
                username: "legituser",
                exercise: "Leg Press",
                personalBest: 22.5,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(201)
            .then(({body: {diary}}) => {
                expect(diary).toEqual({
                    _id: expect.any(String),
                    username: "legituser",
                    exercise: "Leg Press",
                    personalBest: 22.5,
                    logs: []
                })
            })
        })
        test("POST 201: returns the posted diary object when given no personalBest", () => {
            const diary = {
                username: "HumptyDumpty",
                exercise: "Pull Up",
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(201)
            .then(({body: {diary}}) => {
                expect(diary).toEqual({
                    _id: expect.any(String),
                    username: "HumptyDumpty",
                    exercise: "Pull Up",
                    goal: 40,
                    logs: []
                })
            })
        })
        test("POST 400: returns a Bad Request error message when given no username", () => {
            const diary = {
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("No username given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an empty string for username", () => {
            const diary = {
                username: "",
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("No username given")
            })
        })
        test("POST 400: returns a Bad Request error message when username is a number", () => {
            const diary = {
                username: 20,
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Username must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when username is an array", () => {
            const diary = {
                username: ["user", "name"],
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Username must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when username is an object", () => {
            const diary = {
                username: { name: "gymbro"},
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Username must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when no user exists with given username", () => {
            const diary = {
                username: "fakename",
                exercise: "Leg Press",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("No user exists with given username")
            })
        })
        test("POST 400: returns a Bad Request error message when given no exercise", () => {
            const diary = {
                username: "fakename",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("No exercise given")
            })
        })
        test("POST 400: returns a Bad Request error message when given an empty string exercise", () => {
            const diary = {
                username: "gymbro",
                exercise: "",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("No exercise given")
            })
        })
        test("POST 400: returns a Bad Request error message when given a number for exercise", () => {
            const diary = {
                username: "gymbro",
                exercise: 1,
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Exercise must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when given an array for exercise", () => {
            const diary = {
                username: "gymbro",
                exercise: ["Leg Press"],
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Exercise must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object for exercise", () => {
            const diary = {
                username: "gymbro",
                exercise: { name: "Leg Press" },
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Exercise must be a string")
            })
        })
        test("POST 400: returns a Bad Request error message when given a non-existent exercise", () => {
            const diary = {
                username: "gymbro",
                exercise: "Karaoke",
                personalBest: 22.5,
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Exercise does not exist")
            })
        })
        test("POST 400: returns a Bad Request error message when given a string for personalBest", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: "a string",
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("PersonalBest must be a number")
            })
        })
        test("POST 400: returns a Bad Request error message when given an array for personalBest", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: [20],
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("PersonalBest must be a number")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object for personalBest", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: { pb: 20},
                goal: 40,
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("PersonalBest must be a number")
            })
        })
        test("POST 400: returns a Bad Request error message when given a string for goal", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: "a string",
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Goal must be a number")
            })
        })
        test("POST 400: returns a Bad Request error message when given an array for goal", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: [40],
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Goal must be a number")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object for goal", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: {goal: 40},
                logs: []
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Goal must be a number")
            })
        })
        test("POST 400: returns a Bad Request error message when given a string for logs", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: "a string"
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when given a number for logs", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: 2
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when given an object for logs", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: { date: "20-01-2024", log: 20 }
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when given a logs array with a number element", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [1]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when given a logs array with a string element", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: ["log", "logs"]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when given a logs array with an array element", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [[{ date: "20-01-2024", log: 20 }]]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has no date", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{log: 20 }]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has a number for date", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: 10, log: 20 }]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has an array for date", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: ["20-01-2024", "21-01-2024"], log: 20 }]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has an object for date", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: {day: "20-01-2024"}, log: 20 }]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has an empty string for date", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: "", log: 20 }]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has an incorrect string for date", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: "XX-XX-XXXX", log: 20 }]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has no log property", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: "20-01-2024"}]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has a string log property", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: "20-01-2024", log: "two"}]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has an array log property", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: "20-01-2024", log: [2, 3]}]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 400: returns a Bad Request error message when a logs array element has an object log property", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
                personalBest: 20,
                goal: 40,
                logs: [{date: "20-01-2024", log: {value: 2}}]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Logs must be an array of log objects")
            })
        })
        test("POST 409: returns a Conflict error message when existing diary exists for username and exercise", () => {
            const diary = {
                username: "liftqueen",
                exercise: "Stair Machine",
                personalBest: 15,
                goal: 20,
                logs: [
                    {
                        date: "26-08-2024",
                        log: 10
                    },
                    {
                        date: "28-08-2024",
                        log: 15
                    }
                ]
            }

            return request(app)
            .post("/api/diaries")
            .send(diary)
            .expect(409)
            .then(({body: {msg}}) => {
                expect(msg).toEqual("Diary already exists")
            })
        })
        test("PATCH 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .patch("/api/diaries")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("DELETE 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .delete("/api/diaries")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
        test("PUT 405: returns a Method Not Allowed error message", () => {
            return request(app)
            .put("/api/diaries")
            .expect(405)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Request method not allowed on this endpoint")
            })
        })
    })
    describe("?", () => {
        describe("sort", () => {
            test("GET 200: returns diaries ordered by _id when given no value", () => {
                return request(app)
                .get("/api/diaries?sort")
                .expect(200)
                .then(({body: {diaries}}) => {
                    const orderedDiaries = diaries.toSorted((a: MongoDBDiary, b: MongoDBDiary) => {
                        const x = a._id.toString().toLowerCase()
                        const y = b._id.toString().toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })

                    expect(diaries).toEqual(orderedDiaries)
                })
            })
            test("GET 200: returns diaries ordered by _id when passed 'id'", () => {
                return request(app)
                .get("/api/diaries?sort=id")
                .expect(200)
                .then(({body: {diaries}}) => {
                    const orderedDiaries = diaries.toSorted((a: MongoDBDiary, b: MongoDBDiary) => {
                        const x = a._id.toString().toLowerCase()
                        const y = b._id.toString().toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })

                    expect(diaries).toEqual(orderedDiaries)
                })
            })
            test("GET 200: returns diaries ordered by _id when passed '_id'", () => {
                return request(app)
                .get("/api/diaries?sort=_id")
                .expect(200)
                .then(({body: {diaries}}) => {
                    const orderedDiaries = diaries.toSorted((a: MongoDBDiary, b: MongoDBDiary) => {
                        const x = a._id.toString().toLowerCase()
                        const y = b._id.toString().toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })

                    expect(diaries).toEqual(orderedDiaries)
                })
            })
            test("GET 200: returns diaries ordered by username when passed 'username'", () => {
                return request(app)
                .get("/api/diaries?sort=username")
                .expect(200)
                .then(({body: {diaries}}) => {
                    const orderedDiaries = diaries.toSorted((a: MongoDBDiary, b: MongoDBDiary) => {
                        const x = a.username.toLowerCase()
                        const y = b.username.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })

                    expect(diaries).toEqual(orderedDiaries)
                })
            })
            test("GET 200: returns diaries ordered by exercise name when passed 'exercise'", () => {
                return request(app)
                .get("/api/diaries?sort=exercise")
                .expect(200)
                .then(({body: {diaries}}) => {
                    const orderedDiaries = diaries.toSorted((a: MongoDBDiary, b: MongoDBDiary) => {
                        const x = a.exercise.toLowerCase()
                        const y = b.exercise.toLowerCase()
                        if (x < y) return -1
                        if (x > y) return 1
                        return 0
                    })

                    expect(diaries).toEqual(orderedDiaries)
                })
            })
        })
    })
})