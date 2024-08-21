import app from "../src";
import request from 'supertest'

const endpoints = require("../endpoints.json")

describe("GET /api", ()=>{
    it("returns the expected json file", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(endpoints)
        })
    })

})