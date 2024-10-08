import app from "../src";
import request from 'supertest';

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
    describe("?", () => {
        test("GET 400: returns a Bad Request error message if query given", () => {
            return request(app)
            .get("/api?query=this")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid query")
            })
        })
        test("GET 400: returns a Bad Request error message if empty query given", () => {
            return request(app)
            .get("/api?query")
            .expect(400)
            .then(({body: {msg}}) => {
                expect(msg).toBe("Invalid query")
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