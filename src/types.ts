export interface User {
    username: string
}

export interface MongoDBUser extends User {
    _id: string
}

export interface Exercise {
    name: string,
    description: string,
    icon: string
}

export interface MongoDBExercise extends Exercise {
    _id: string
}

export interface Log {
    date: string,
    log: number
}

export interface Diary {
    username: string,
    exercise: string,
    pb?: number,
    goal?: number,
    logs: Log[]
}