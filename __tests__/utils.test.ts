import { generateUserErrorMessage } from "../src/utils/user.utils";

describe("generateUserErrorMessage", () => {
    it("returns an empty string if provided a valid user object", () => {
        const user = { username: "Jeff"}
        
        const output = generateUserErrorMessage(user)

        expect(output).toBe("")
    })
    it("returns correct error message if user object is empty", () => {
        const user = {}
        
        const output = generateUserErrorMessage(user)

        expect(output).toBe("No request body given")
    })
    it("returns correct error message if user object has no username", () => {
        const user = { key: "value"}
        
        const output = generateUserErrorMessage(user)

        expect(output).toBe("No username given")
    })
    it("returns correct error message if username is an empty string", () => {
        const user = { username: ""}
        
        const output = generateUserErrorMessage(user)

        expect(output).toBe("No username given")
    })
    it("returns correct error message if username is not a string", () => {
        const numberUsername = { username: 3}
        const numberUsernameOutput = generateUserErrorMessage(numberUsername)
        expect(numberUsernameOutput).toBe("Username must be a string")

        const arrayUsername = { username: ["username"]}
        const arrayUsernameOutput = generateUserErrorMessage(arrayUsername)
        expect(arrayUsernameOutput).toBe("Username must be a string")

        const objectUsername = { username: {username: "username"}}
        const objectUsernameOutput = generateUserErrorMessage(objectUsername)
        expect(objectUsernameOutput).toBe("Username must be a string")
    })
    it("returns correct error message if user object has extra properties", () => {
        const user = { username: "Jeff", age: 22}
        
        const output = generateUserErrorMessage(user)

        expect(output).toBe("Request body should only provide a username")
    })
    // no need for a test checking user is an object, as this is req.body
})