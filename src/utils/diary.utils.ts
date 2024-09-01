export const checkDiaryInvalid = (diary: any): boolean => {
    const {username} = diary
    
    if (username === "" || username === undefined) {
        return true
    }
    return false
}