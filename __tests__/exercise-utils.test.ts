import { generateExerciseErrorMessage } from "../src/utils/exercise.utils";

describe("generateExerciseErrorMessage", () => {
    test("returns an empty string for a valid exercise object", () => {
        const exercise = { 
            name: "exercise name",
            description: "description",
            icon: "filename"
        }

        const output = generateExerciseErrorMessage(exercise)

        expect(output).toBe("")
    })
})