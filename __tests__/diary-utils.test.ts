import { checkDiarySort, generateDiaryErrorMessage } from "../src/utils/diary.utils"

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
    it("returns correct error string for a diary with a number for username", () => {
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
    it("returns correct error string for a diary with an array for username", () => {
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
    it("returns correct error string for a diary with an object for username", () => {
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
    it("returns correct error string for a diary with a number for exercise", () => {
        const input = {
            username: "gymbro",
            exercise: 1,
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Exercise must be a string")
    })
    it("returns correct error string for a diary with an array for exercise", () => {
        const input = {
            username: "gymbro",
            exercise: ["Leg Press"],
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Exercise must be a string")
    })
    it("returns correct error string for a diary with an object for exercise", () => {
        const input = {
            username: "gymbro",
            exercise: { name: "Leg Press" },
            personalBest: 2,
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Exercise must be a string")
    })
    it("returns correct error string for a diary with a string for personalBest", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: "two",
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("PersonalBest must be a number")
    })
    it("returns correct error string for a diary with an array for personalBest", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: [2],
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("PersonalBest must be a number")
    })
    it("returns correct error string for a diary with an object for personalBest", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: {pb: 2},
            goal: 4,
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("PersonalBest must be a number")
    })
    it("returns correct error string for a diary with a string for goal", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: "two",
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Goal must be a number")
    })
    it("returns correct error string for a diary with an array for goal", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: [4],
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Goal must be a number")
    })
    it("returns correct error string for a diary with an object for goal", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: {goal: 4},
            logs: []
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Goal must be a number")
    })
    it("returns correct error string for a diary with a string for logs", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: "string"
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary with a number for logs", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: 1
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary with an object for logs", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: {date: "20-01-2024", log: 20}
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary with a string element in logs array", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: ["string"]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary with a number element in logs array", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [1]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary with an array element in logs array", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [[{date: "20-01-2024", log: 20}]]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has no date", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{log: 20}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has a number for date", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: 1, log: 20}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has an array for date", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: ["20-01-2024"], log: 20}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has an object for date", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: {day: "20-01-2024"}, log: 20}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has an empty string for date", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: "", log: 20}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has an incorrect string for date", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: "XX-XX-XXXX", log: 20}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has no log property", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: "20-01-2024"}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has a string log property", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: "20-01-2024", log: "two"}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has an array log property", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: "20-01-2024", log: [2, 2]}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
    it("returns correct error string for a diary if an element in logs has an object log property", () => {
        const input = {
            username: "gymbro",
            exercise: "Leg Press",
            personalBest: 2,
            goal: 4,
            logs: [{date: "20-01-2024", log: {value: 2}}]
        }

        const output = generateDiaryErrorMessage(input)

        expect(output).toBe("Logs must be an array of log objects")
    })
})

describe("checkDiarySort", () => {
    it("returns true when passed undefined", () => {
        const output = checkDiarySort(undefined)
        expect(output).toBe(true)
    })
})