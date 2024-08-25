export const generateUserErrorMessage = (user: any): String => {
    const {username} = user
    const userProperties = Object.keys(user).length

    if (userProperties === 0) {
        return "No request body given"
    }
    if (username === undefined || username === "") {
        return "No username given"
    }
    if (typeof username !== "string") {
        return "Username must be a string"
    }
    if (userProperties > 1) {
        return "Request body should only provide a username"
    }
    return ""
}