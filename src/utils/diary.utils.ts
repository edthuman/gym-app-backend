export const generateDiaryErrorMessage = (diary: any): string => {
    const {username, exercise, personalBest } = diary
    
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
    return ""
}