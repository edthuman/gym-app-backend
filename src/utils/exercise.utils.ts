export const getExerciseErrorMessage = (exercise: any) => {
    const numberOfProperties = Object.keys(exercise).length
    const { name, description, icon } = exercise
    
    if (numberOfProperties === 0) {
        return "No request body given"
    }

    // checks for missing properties, returned error message states first missing property found
    if (!name) {
        return "No name given"
    }
    if (typeof name !== "string") {
        return "Name must be a string"
    }
    if (!description) {
        return "No description given"
    }
    if (typeof description !== "string") {
        return "Description must be a string"
    }
    if (!icon) {
        return "No icon given"
    }
    if (typeof icon !== "string") {
        return "Icon must be a string"
    }

    if (numberOfProperties > 3) {
        return "Request body should only include name, description, and icon"
    }

    return ""
}