import request from "supertest"
import app from "../src"

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
                            date: expect.stringMatching(/\d\d-\d\d-\d\d/),
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
                username: "gymbro",
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
                    username: "gymbro",
                    exercise: "Leg Press",
                    personalBest: 22.5,
                    goal: 40,
                    logs: []
                })
            })
        })
        test("POST 201: returns the posted diary object when given no goal", () => {
            const diary = {
                username: "gymbro",
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
                    username: "gymbro",
                    exercise: "Leg Press",
                    personalBest: 22.5,
                    logs: []
                })
            })
        })
        test("POST 201: returns the posted diary object when given no personalBest", () => {
            const diary = {
                username: "gymbro",
                exercise: "Leg Press",
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
    })
})