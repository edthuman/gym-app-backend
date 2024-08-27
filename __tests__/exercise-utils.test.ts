import { generateExerciseErrorMessage } from "../src/utils/exercise.utils";

describe("generateExerciseErrorMessage", () => {
    it("returns an empty string for a valid exercise object", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            icon: "filename"
        }

        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("")
    })
    it("returns correct error message when given an empty object", () => {
        const input = {}
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No request body given")
    })
    it("returns correct error message when exercise missing name property", () => {
        const input = { 
            description: "description",
            icon: "filename"
        }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise missing description property", () => {
        const input = { 
            name: "exercise name",
            icon: "filename"
        }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No description given")
    })
    it("returns correct error message when exercise missing icon property", () => {
        const input = { 
            name: "exercise name",
            description: "description",
        }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No icon given")
    })
    it("returns correct error message when exercise missing multiple properties", () => {
        const input = { icon: "file" }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise name is an empty string", () => {
        const input = { 
            name: "",
            description: "description",
            icon: "filename"
        }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise description is an empty string", () => {
        const input = {
            name: "exercise name",
            description: "",
            icon: "filename"
        }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No description given")
    })
    it("returns correct error message when exercise icon is an empty string", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            icon: ""
        }
        const output = generateExerciseErrorMessage(input)

        expect(output).toBe("No icon given")
    })
})