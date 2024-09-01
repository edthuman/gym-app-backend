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
})