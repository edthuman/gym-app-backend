# Gym Tracking API

This API allows users to connect and interact with a database of tracking data for various machines at the gym.

## Get started

To begin working on this project, first download the repo using shell command:

```
git clone https://github.com/edthuman/gym-app-backend
```

You then need to install the required dependencies, by running either of these commands: 

```
npm install
npm i
```

## Connecting to a MongoDB database

In order to connect to a database, you need to create a file containing a connection string.

Create a file at the root of your project's folder called uri.ts and add the text below, replacing \<connection string> with your connection string:

```
const uri = "<connection string>"

export { uri }
```

> [!NOTE]
> For information on obtaining a connection string, refer to the MongoDB docs: https://www.mongodb.com/docs/, 
>
> Or see this page about connection strings: https://www.mongodb.com/resources/products/fundamentals/mongodb-connection-string
>
> Links correct as of 17th August 2024 - they may be updated, moved, or removed

## Working on the API

You're now set up to begin working on the API!

To create a version of the server that updates with live changes made, run the command:

```
npm run app
```

This sets up a live development server using nodemon that allows you to make requests to your API via your browser or a platform like Insomnia (https://insomnia.rest/).