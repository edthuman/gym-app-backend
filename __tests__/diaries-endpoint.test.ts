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
    })
})