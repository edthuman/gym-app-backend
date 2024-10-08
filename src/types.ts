export interface User {
    username: string
}

export interface MongoDBUser extends User {
    _id: string
}

export interface Exercise {
    name: string,
    description: string,
    category: string,
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
    personalBest?: number,
    goal?: number,
    logs: Log[]
}

export interface MongoDBDiary extends Diary {
    _id: String
}