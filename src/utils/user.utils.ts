export const getUserError = (user: any): string => {
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

export const sortUsers = (users: any[], sort: any, order: any): any[] => {
    const sortedUsers = [...users]
    if (sort === "username" || sort === "") {
        sortedUsers.sort((a, b) => {
            const x = a.username.toLowerCase()
            const y = b.username.toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
    } else {
        sortedUsers.sort((a, b) => {
            const x = a._id.toString().toLowerCase()
            const y = b._id.toString().toLowerCase()
            if (x < y) return -1
            if (x > y) return 1
            return 0
        })
    }

    const isOrderDescending = ["desc", "DESC", "descending"].includes(order)
    if (isOrderDescending) {
        sortedUsers.reverse()
    }
    return sortedUsers
}

export const findInvalidUserQueries = (queries: string[]): boolean => {
    const validQueries = ["sort", "order", "username"]
    const isInvalidQuery = queries.some((query) => !validQueries.includes(query))
    return isInvalidQuery
}

export const checkUserSort = (sort: any): boolean => {
    const validSortCriteria: any[] = ["username", "id", "_id", "", undefined]
    const isInvalidSort = !validSortCriteria.includes(sort)
    return isInvalidSort
}

export const checkUserOrder = (order: any): boolean => {
    const validOrderCriteria: any[] = ["DESC", "desc", "descending", "ASC", "asc", "ascending", "", undefined]
    const isInvalidOrder = !validOrderCriteria.includes(order)
    return isInvalidOrder
}