import { readFile } from "fs";
import app from "../src";

import request from 'supertest'

describe("GET /api", ()=>{
    it("returns the expected json file", async() => {
        const response = await request(app)
        .get("/api")

        readFile(`${__dirname}/../endpoints.json`, { encoding: "utf-8" }, (err, expectedEndpoints) => {
            if (err) {
                console.log("Error obtaining endpoints.json \n", err)
            }
            expect(response.statusCode).toBe(200)
            expect(response.text).toBe(expectedEndpoints)
        })

        //test is passing before readfile completes
    })
})