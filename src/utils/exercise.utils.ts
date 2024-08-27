export const getExerciseErrorMessage = (exercise: any) => {
    const numberOfProperties = Object.keys(exercise).length
    
    if (numberOfProperties === 0) {
        return "No request body given"
    }

    // checks for missing properties, returned error message states first missing property found
    if (!exercise.name) {
        return "No name given"
    }
    if (!exercise.description){
        return "No description given"
    }
    if (!exercise.icon) {
        return "No icon given"
    }

    return ""
}