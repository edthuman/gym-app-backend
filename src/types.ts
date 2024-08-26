export interface User {
    username: String
}

export interface MongoDBUser extends User {
    _id: String
}

export interface Exercise {
    name: String,
    description: String,
    icon: String
}

export interface MongoDBExercise extends Exercise {
    _id: String
}