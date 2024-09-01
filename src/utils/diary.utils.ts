export const generateDiaryErrorMessage = (diary: any): string => {
    const {username, exercise } = diary
    
    if (username === "" || username === undefined) {
        return "No username given"
    }
    if (exercise === "" || exercise === undefined) {
        return "No exercise given"
    }
    return ""
}