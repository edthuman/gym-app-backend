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