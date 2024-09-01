import { generateDiaryErrorMessage } from "../src/utils/diary.utils"

describe("generateDiaryErrorMessage", () => {
    it("returns false for a valid diary object", () => {
        const input = {
            name: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe(false)
    })
    it("returns true for a diary with no username", () => {
        const input = {
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe(true)
    })
    it("returns true for a diary with an empty string username", () => {
        const input = {
            username: "",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe(true)
    })
})