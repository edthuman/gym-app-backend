export const getExerciseErrorMessage = (exercise: any): string => {
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

export const sortExercises = (exercises: any[], sort: any, order: any): any[] => {
    const sortedArray = [...exercises]
    if (sort === "" || sort === "name") {
        sortedArray.sort((a, b) => {
            const x = a.name.toLowerCase()
            const y = b.name.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
    }

    const isOrderDescending = ["desc", "DESC", "descending"].includes(order)
    if (isOrderDescending) {
        sortedArray.reverse()
    }
    return sortedArray
}

export const findInvalidExerciseQueries = (queries: any[]): boolean => {
    const validQueries = ["sort", "order"]
    const isInvalidQuery = queries.some((query) => !validQueries.includes(query))
    return isInvalidQuery
}

export const checkExerciseSort = (sort: any): boolean => {
    const validSortCriteria: any[] = ["id", "_id", "name", "", undefined]
    const isInvalid = !validSortCriteria.includes(sort)
    return isInvalid
}

export const checkExerciseOrder = (order: any): boolean => {
    const validOrderCriteria: any[] = ["asc", "ASC", "ascending", "desc", "DESC", "descending", "", undefined]
    const isInvalid = !validOrderCriteria.includes(order)
    return isInvalid
}