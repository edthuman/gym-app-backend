export interface UserInput {
    username: String
}

export interface MongoDBUser {
    _id: String,
    username: String
}

export interface Exercise {
    name: String,
    description: String,
    icon: String
}

export interface MongoDBExercise extends Exercise {
    _id: String
}