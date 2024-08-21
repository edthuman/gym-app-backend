import app from "../src";
import request from 'supertest'

const endpoints = require("../endpoints.json")

describe("GET /api", ()=>{
    it("returns the expected json file", async () => {
        const response = await request(app)
        .get("/api")

        const parsedResponse = JSON.parse(response.text)

        expect(response.statusCode).toBe(200)
        expect(parsedResponse).toEqual(endpoints)
    })

})