import { validateUserInput } from "../src/utils/user.utils";

describe("validateUserInput", () => {
    it("returns an empty string if provided a valid user object", () => {
        const user = { username: "Jeff"}
        
        const output = validateUserInput(user)

        expect(output).toBe("")
    })
})