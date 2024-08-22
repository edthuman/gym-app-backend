import app from "../src";
import request from 'supertest'

const endpoints = require("../endpoints.json")

describe("/api", ()=>{
    test("GET 200: returns the expected json file", () => {
        const expectedEndpoints = { endpoints }

        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(expectedEndpoints)
        })
    })
    test("POST 405: returns an error message", ()=> {
        return request(app)
        .post("/api")
        .expect(405)
        .then(({ body: { msg }}) => {
            expect(msg).toBe("Request method not allowed on this endpoint")
        })
    })
})