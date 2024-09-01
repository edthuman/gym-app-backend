import { generateDiaryErrorMessage } from "../src/utils/diary.utils"

describe("generateDiaryErrorMessage", () => {
    it("returns an empty string for a valid diary object", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("")
    })
    it("returns correct error string for a diary with no username", () => {
        const input = {
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("No username given")
    })
    it("returns correct error string for a diary with an empty string username", () => {
        const input = {
            username: "",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("No username given")
    })
    it("returns correct error string for a diary with a number username", () => {
        const input = {
            username: 1,
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Username must be a string")
    })
    it("returns correct error string for a diary with an array username", () => {
        const input = {
            username: ["gymbro"],
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Username must be a string")
    })
    it("returns correct error string for a diary with an object username", () => {
        const input = {
            username: { name: "gymbro" },
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Username must be a string")
    })
    it("returns correct error string for a diary with no exercise", () => {
        const input = {
            username: "gymbro",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("No exercise given")
    })
    it("returns correct error string for a diary with an empty string exercise", () => {
        const input = {
            username: "gymbro",
            exercise: "",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("No exercise given")
    })
})