export const generateDiaryErrorMessage = (diary: any): string => {
    const {username} = diary
    
    if (username === "" || username === undefined) {
        return "No username given"
    }
    return ""
}