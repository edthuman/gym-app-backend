export const generateDiaryErrorMessage = (diary: any): string => {
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
        return {
            $addToSet: { logs: { $each: [...patchObject.logs] }}
        }
    }   
    return { $set : patchObject }
} 