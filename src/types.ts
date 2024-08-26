export interface UserInput {
    username: String
}

export interface MongoDBUser {
    _id: String,
    username: String
}

export interface MongoDBExercise {
    _id: String,
    name: String,
    description: String,
    icon: String
}