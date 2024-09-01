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
        const isElementObject = Object.prototype.toString.apply(logs[i]) === "[object Object]"
        if (!isElementObject) {
            return "Logs must be an array of log objects"
        }
    }
    return ""
}