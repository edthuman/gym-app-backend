import { getExerciseErrorMessage } from "../src/utils/exercise.utils";

describe("getExerciseErrorMessage", () => {
    it("returns an empty string for a valid exercise object", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            icon: "filename"
        }

        const output = getExerciseErrorMessage(input)

        expect(output).toBe("")
    })
    it("returns correct error message when given an empty object", () => {
        const input = {}
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No request body given")
    })
    it("returns correct error message when exercise missing name property", () => {
        const input = { 
            description: "description",
            icon: "filename"
        }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise missing description property", () => {
        const input = { 
            name: "exercise name",
            icon: "filename"
        }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No description given")
    })
    it("returns correct error message when exercise missing icon property", () => {
        const input = { 
            name: "exercise name",
            description: "description",
        }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No icon given")
    })
    it("returns correct error message when exercise missing multiple properties", () => {
        const input = { icon: "file" }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise name is an empty string", () => {
        const input = { 
            name: "",
            description: "description",
            icon: "filename"
        }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No name given")
    })
    it("returns correct error message when exercise description is an empty string", () => {
        const input = {
            name: "exercise name",
            description: "",
            icon: "filename"
        }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No description given")
    })
    it("returns correct error message when exercise icon is an empty string", () => {
        const input = { 
            name: "exercise name",
            description: "description",
            icon: ""
        }
        const output = getExerciseErrorMessage(input)

        expect(output).toBe("No icon given")
    })
    it("returns correct error message when exercise name is not a string", () => {
        const description = "description"
        const icon = "icon"

        const numberName = { name : 1, description, icon }
        const numberOutput = getExerciseErrorMessage(numberName)

        const arrayName = { name: [], description, icon }
        const arrayOutput = getExerciseErrorMessage(arrayName)
        
        const objectName = { name: {}, description, icon }
        const objectOutput = getExerciseErrorMessage(objectName)

        const expectedOutput = "Name must be a string"

        expect(numberOutput).toBe(expectedOutput)
        expect(arrayOutput).toBe(expectedOutput)
        expect(objectOutput).toBe(expectedOutput)
    })
    it("returns correct error message when exercise description is not a string", () => {
        const name = "name"
        const icon = "icon"

        const numberDescription = { name, description: 1, icon }
        const numberOutput = getExerciseErrorMessage(numberDescription)

        const arrayDescription = { name, description: [], icon }
        const arrayOutput = getExerciseErrorMessage(arrayDescription)
        
        const objectDescription = { name, description: {}, icon }
        const objectOutput = getExerciseErrorMessage(objectDescription)

        const expectedOutput = "Description must be a string"

        expect(numberOutput).toBe(expectedOutput)
        expect(arrayOutput).toBe(expectedOutput)
        expect(objectOutput).toBe(expectedOutput)
    })
})