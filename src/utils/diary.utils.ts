import { Log } from "../types"

export const getDiaryError = (diary: any): string => {
    const {username, exercise, personalBest, goal, logs } = diary
    
    if (username === "" || username === undefined) {
        return "No username given"
    }
    if (typeof username !== "string") {
        return "Username must be a string"
    }
    if (exercise === "" || exercise === undefined) {
        return "No exercise given"
    }
    if (typeof exercise !== "string") {
        return "Exercise must be a string"
    }
    if (typeof personalBest !== "number" && personalBest !== undefined) {
        return "PersonalBest must be a number"
    }
    if (typeof goal !== "number" && goal !== undefined) {
        return "Goal must be a number"
    }
    if (logs === undefined) {
        return ""
    }
    if (!Array.isArray(logs)) {
        return "Logs must be an array of log objects"
    }

    for (let i = 0; i < logs.length; i++) {
        const element = logs[i]
        const isElementObject = Object.prototype.toString.apply(element) === "[object Object]"
        if (!isElementObject) {
            return "Logs must be an array of log objects"
        }
        const isDateValid = typeof element.date === "string" && /\d\d-\d\d-\d\d\d\d/.test(element.date)

        const isLogValid = typeof element.log === "number"
        if (!isDateValid || !isLogValid) {
            return "Logs must be an array of log objects"
        }
    }
    return ""
}

export const checkDiarySort = (sort: any): boolean => {
    const validSorts = ["id", "_id", "username", "exercise", "", undefined]
    return !validSorts.includes(sort)
}

export const checkDiaryOrder = (order: any): boolean => {
    const validOrder = ["asc", "ASC", "ascending", "desc", "DESC", "descending", "", undefined]
    return !validOrder.includes(order)
}

export const checkDiaryQueries = (queries: any[]) => {
    const validQueries = ["sort", "order", "username", "exercise"]
    let isInvalidQuery = false

    queries.forEach((query) => {
        if (!validQueries.includes(query)) {
            isInvalidQuery = true
        }
    })
    
    return isInvalidQuery
}

export const formatPatchObject = (patchObject: any) => { 
    if (patchObject.hasOwnProperty("logs")) {
        const {logs, personalBest, goal} = patchObject

        const formattedPatch: any = { 
            $addToSet: { logs: { $each: [...logs] }},
            $max: { personalBest: personalBest }
        }
        if (goal) {
            formattedPatch.$set = { goal }
        }
        return formattedPatch
    }
    return { $set : patchObject }
}

export const generateDiaryPatchError = (patchBody: any): string => {
    const properties = Object.keys(patchBody)

    const isEmptyBody = properties.length === 0
    if (isEmptyBody) {
        return "No request body given"
    }

    if (properties.includes("username")) {
        return "Request should not provide a username"
    }
    if (properties.includes("exercise")) {
        return "Request should not provide an exercise"
    }

    const { logs, personalBest, goal } = patchBody

    if (personalBest && typeof personalBest !== "number") {
        return "PersonalBest must be a number"
    }

    if (goal && typeof goal !== "number") {
        return "Goal must be a number"
    }

    if (logs) {
        if (!Array.isArray(logs)) {
            return "Logs must be an array"
        }

        for (let i = 0; i < logs.length; i++) {
            const {date, log} = logs[i]
            if (!date) {
                return "Logs must have a date"
            }
            if (typeof date !== "string") {
                return "Dates must be a string"
            }
            const dateRegex = /^\d\d-\d\d-\d\d\d\d$/
            const isInvalidDate = !dateRegex.test(date)
            if (isInvalidDate) {
                return "Dates must be formatted DD-MM-YYYY"
            }

            const calendar: any = {
                "01": 31,
                "02": 29,
                "03": 31,
                "04": 30,
                "05": 31,
                "06": 30,
                "07": 31,
                "08": 31,
                "09": 30,
                "10": 31,
                "11": 30,
                "12": 31,
            }

            const day = Number(date.slice(0, 2))
            const month = Number(date.slice(3, 5))
            const year = Number(date.slice(6, 10))

            const daysInMonth = calendar[date.slice(3,5)]

            const isInvalidDay: any = day < 1 || day > daysInMonth
            const isInvalidMonth = month < 1 || month > 12
            const isInvalidYear = year < 2024

            if (isInvalidDay || isInvalidMonth || isInvalidYear) {
                return "Invalid date"
            }

            if (!log) {
                return "Logs must have a log property"
            }
            if (typeof log !== "number") {
                return "Log must be a number"
            }
        }

        const logValues = logs.map((logItem: Log) => logItem.log)
        const highestLog = Math.max(...logValues)

        if (properties.includes("personalBest") && highestLog > personalBest) {
                return "PersonalBest cannot be below a log"
        }
        if (properties.includes("goal") && highestLog > goal) {
            return "Goal cannot be below a log"
    }
    }

    return ""
} 