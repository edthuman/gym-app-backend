import { checkDiaryOrder, checkDiaryQueries, checkDiarySort, formatPatchObject, generateDiaryErrorMessage, generateDiaryPatchError } from "../src/utils/diary.utils"

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
    it("returns false when passed undefined", () => {
        const output = checkDiarySort(undefined)
        expect(output).toBe(false)
    })
    it("returns false when passed an empty string", () => {
        const output = checkDiarySort("")
        expect(output).toBe(false)
    })
    it("returns false when passed 'id'", () => {
        const output = checkDiarySort("id")
        expect(output).toBe(false)
    })
    it("returns false when passed '_id'", () => {
        const output = checkDiarySort("_id")
        expect(output).toBe(false)
    })
    it("returns false when passed 'username'", () => {
        const output = checkDiarySort("username")
        expect(output).toBe(false)
    })
    it("returns false when passed 'exercise'", () => {
        const output = checkDiarySort("exercise")
        expect(output).toBe(false)
    })
    it("returns true when passed an invalid sort", () => {
        const output = checkDiarySort("random")
        expect(output).toBe(true)
    })
    it("returns true when passed a string of 'undefined'", () => {
        const output = checkDiarySort("undefined")
        expect(output).toBe(true)
    })
    it("returns true when passed a number", () => {
        const output = checkDiarySort(10)
        expect(output).toBe(true)
    })
    it("returns true when passed an array", () => {
        const output = checkDiarySort(["id", "username", "exercise"])
        expect(output).toBe(true)
    })
    it("returns true when passed an object", () => {
        const output = checkDiarySort({sort: "id"})
        expect(output).toBe(true)
    })
    it("returns true when passed null", () => {
        const output = checkDiarySort(null)
        expect(output).toBe(true)
    })
})

describe("checkDiaryOrder", () => {
    it("returns false when passed undefined", () => {
        const output = checkDiaryOrder(undefined)
        expect(output).toBe(false)
    })
    it("returns false when passed an empty string", () => {
        const output = checkDiaryOrder("")
        expect(output).toBe(false)
    })
    it("returns false when passed 'asc'", () => {
        const output = checkDiaryOrder("asc")
        expect(output).toBe(false)
    })
    it("returns false when passed 'ASC'", () => {
        const output = checkDiaryOrder("ASC")
        expect(output).toBe(false)
    })
    it("returns false when passed 'ascending'", () => {
        const output = checkDiaryOrder("ascending")
        expect(output).toBe(false)
    })
    it("returns false when passed 'desc'", () => {
        const output = checkDiaryOrder("desc")
        expect(output).toBe(false)
    })
    it("returns false when passed 'DESC'", () => {
        const output = checkDiaryOrder("DESC")
        expect(output).toBe(false)
    })
    it("returns false when passed 'descending'", () => {
        const output = checkDiaryOrder("descending")
        expect(output).toBe(false)
    })
    it("returns true when passed an invalid order", () => {
        const output = checkDiaryOrder("random")
        expect(output).toBe(true)
    })
    it("returns true when passed 'undefined' as a string", () => {
        const output = checkDiaryOrder("undefined")
        expect(output).toBe(true)
    })
    it("returns true when passed a number", () => {
        const output = checkDiaryOrder(5)
        expect(output).toBe(true)
    })
    it("returns true when passed an array", () => {
        const output = checkDiaryOrder(["asc"])
        expect(output).toBe(true)
    })
    it("returns true when passed an array", () => {
        const output = checkDiaryOrder({order: "asc"})
        expect(output).toBe(true)
    })
})

describe("checkDiaryQueries", () => {
    it("returns false when passed sort", () => {
        const output = checkDiaryQueries(["sort"])
        expect(output).toBe(false)
    })
    it("returns false when passed order", () => {
        const output = checkDiaryQueries(["order"])
        expect(output).toBe(false)
    })
    it("returns false when passed username", () => {
        const output = checkDiaryQueries(["username"])
        expect(output).toBe(false)
    })
    it("returns false when passed exercise", () => {
        const output = checkDiaryQueries(["exercise"])
        expect(output).toBe(false)
    })
    it("returns false when passed multiple valid queries", () => {
        const output = checkDiaryQueries(["sort", "order", "username", "exercise"])
        expect(output).toBe(false)
    })
    it("returns false when passed an empty array", () => {
        const output = checkDiaryQueries([])
        expect(output).toBe(false)
    })
    it("returns true when passed an invalid query", () => {
        const output = checkDiaryQueries(["invalid"])
        expect(output).toBe(true)
    })
    it("returns true when passed an invalid query alongside other ", () => {
        const output = checkDiaryQueries(["sort", "invalid"])
        expect(output).toBe(true)
    })
})

describe("formatPatchObject", () => {
    it("returns the correct object when passed personalBest", () => {
        const input =  { personalBest: 20 }

        const output = formatPatchObject(input)
        const expectedOutput = { $set: { personalBest: 20 }}

        expect(output).toEqual(expectedOutput)
    })
    it("returns the correct object when passed goal", () => {
        const input =  { goal: 25 }

        const output = formatPatchObject(input)
        const expectedOutput = { $set: { goal: 25 }}

        expect(output).toEqual(expectedOutput)
    })
    it("returns the correct object when passed a logs array with one item", () => {
        const input =  { logs: [
            { date: "20-01-2024", log: 10 }
        ]}

        const output = formatPatchObject(input)

        const expectedOutput = { 
            $addToSet: { 
                logs: {
                    $each: [
                        { date: "20-01-2024", log: 10 }
                    ]
                }
            }
        }

        expect(output).toMatchObject(expectedOutput)
    })
    it("returns the correct object when passed a logs array with multiple items", () => {
        const input =  { logs: [
            { date: "20-01-2024", log: 10 },
            { date: "21-01-2024", log: 11 },
            { date: "22-01-2024", log: 12 }
        ]}

        const output = formatPatchObject(input)

        const expectedOutput = { 
            $addToSet: { 
                logs: {
                    $each: [
                        { date: "20-01-2024", log: 10 },
                        { date: "21-01-2024", log: 11 },
                        { date: "22-01-2024", log: 12 }
                    ]
                }
            }
        }

        expect(output).toMatchObject(expectedOutput)
    })
})

describe("generateDiaryPatchError", () => {
    it("returns an error message when passed an object with no keys", () => {
        const input = {}
        const output = generateDiaryPatchError(input)

        expect(output).toBe("No request body given")
    })
    it("returns an error message when passed an object with an exercise property", () => {
        const input = { exercise: "Rowing Machine" }
        const output = generateDiaryPatchError(input)

        expect(output).toBe("Request should not provide an exercise")
    })
    it("returns an error message when passed an object with a username property", () => {
        const input = { username: "gymbro" }
        const output = generateDiaryPatchError(input)

        expect(output).toBe("Request should not provide a username")
    })
    it("returns an error message when personalBest is below a log in logs array", () => {
        const input = { 
            personalBest: 10,
            logs: [ 
                { date: "01-09-2024", log: 15 }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("PersonalBest cannot be below a log")
    })
    it("returns an error message when goal is below a log in logs array", () => {
        const input = { 
            goal: 10,
            logs: [ 
                { date: "02-09-2024", log: 15 }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Goal cannot be below a log")
    })
    it("returns an error message when a logs is an object", () => {
        const input = { logs: { date: "02-09-2024", log: 10 } }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Logs must be an array")
    })
    it("returns an error message when a logs is a string", () => {
        const input = { logs: "log" }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Logs must be an array")
    })
    it("returns an error message when a logs is a number", () => {
        const input = { logs: 10 }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Logs must be an array")
    })
    it("returns an error message when a log in logs array is missing a date", () => {
        const input = { 
            logs: [ 
                { log: 15 }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Logs must have a date")
    })
    it("returns an error message when a log has date as a number", () => {
        const input = { 
            logs: [ 
                { date: 10, log: 15 }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Dates must be a string")
    })
    it("returns an error message when a log has date as an object", () => {
        const input = { 
            logs: [ 
                { date: {day: "02-09-2024"}, log: 15 }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Dates must be a string")
    })
    it("returns an error message when a log has date as an object", () => {
        const input = { 
            logs: [ 
                { date: ["02-09-2024"], log: 15 }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Dates must be a string")
    })
    it("returns an error message when a log in logs array has no log property", () => {
        const input = { 
            logs: [ 
                { date: "02-09-2024" }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Logs must have a log property")
    })
    it("returns an error message when a log has a string log property", () => {
        const input = { 
            logs: [ 
                { date: "02-09-2024", log: "10" }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Log must be a number")
    })
    it("returns an error message when a log has an array log property", () => {
        const input = { 
            logs: [ 
                { date: "02-09-2024", log: [10] }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Log must be a number")
    })
    it("returns an error message when a log has an object log property", () => {
        const input = { 
            logs: [ 
                { date: "02-09-2024", log: {value: 10} }
            ]
        }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Log must be a number")
    })
    it("returns an error message when personalBest is a string", () => {
        const input = { personalBest: "10" }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("PersonalBest must be a number")
    })
    it("returns an error message when personalBest is an array", () => {
        const input = { personalBest: [10] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("PersonalBest must be a number")
    })
    it("returns an error message when personalBest is an object", () => {
        const input = { personalBest: {value: 10} }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("PersonalBest must be a number")
    })
    it("returns an error message when goal is a string", () => {
        const input = { goal: "15" }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Goal must be a number")
    })
    it("returns an error message when goal is an array", () => {
        const input = { goal: [15] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Goal must be a number")
    })
    it("returns an error message when goal is an object", () => {
        const input = { goal: {value: 15} }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Goal must be a number")
    })
    it("returns an error message when a date has letters", () => {
        const input = { logs: [{ date: "XX-XX-XXXX", log: 15}] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Dates must be formatted DD-MM-YYYY")
    })
    it("returns an error message when a date does not use dashes", () => {
        const input = { logs: [{ date: "01/01/2024", log: 15}] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Dates must be formatted DD-MM-YYYY")
    })
    it("returns an error message when a date is too long", () => {
        const input = { logs: [{date: "02-09-2024-00:00am", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Dates must be formatted DD-MM-YYYY")
    })
    it("returns an error message when a date has day 00", () => {
        const input = { logs: [{date: "00-09-2024", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Invalid date")
    })
    it("returns an error message when a date has day above 31", () => {
        const input = { logs: [{date: "32-09-2024", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Invalid date")
    })
    it("returns an error message when a date has month 00", () => {
        const input = { logs: [{date: "01-00-2024", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Invalid date")
    })
    it("returns an error message when a date has month above 12", () => {
        const input = { logs: [{date: "01-13-2024", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Invalid date")
    })
    it("returns an error message when a date has year before 2024", () => {
        const input = { logs: [{date: "01-12-2023", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Invalid date")
    })
    it("returns an error message when a date with day 30 does not exist", () => {
        const input = { logs: [{date: "30-02-2024", log: 15 }] }

        const output = generateDiaryPatchError(input)

        expect(output).toBe("Invalid date")
    })
})