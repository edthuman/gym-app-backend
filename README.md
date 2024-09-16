# Gym Tracking API

This API allows users to connect and interact with a database of tracking data for various machines at the gym. It has been written in Typescript, and uses MongoDB Atlas for its development and production databases, with a Memory Server (via [mongodb-memory-server](https://github.com/typegoose/mongodb-memory-server)) used for testing.

Link to the live project hosted by Render: https://gym-app-0nbt.onrender.com/api

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

Finally, to avoid revealing secrets or adding unnecessary files to GitHub, add a file called ".gitignore" with the following text:

```
.gitignore
node_modules
.env*
```

## Connecting to MongoDB

To create your own version of this project, you will need a MongoDB Atlas account (via https://www.mongodb.com/).

Once you have an Atlas account, you should create two clusters - one for development data and another for production data - which can be named anything you deem appropriate.

Within each cluster you should add a collection called "gym-app", in which you add three empty databases: "users", "exercises", and "diaries".

To allow connection with the clusters, you need to add the relevant IP addresses to each. For the development cluster, this will be IP addresses for any networks you or someone else will use when working on the project.

> [!NOTE]
> You do not need to know your IP address, simply go to the 'Overview' tab once in MongoDB Atlas. There should be this warning at the top of the page: "Current IP Address not added. You will not be able to connect to databases from this address". Click the 'Add Current IP Address" button to the right of this message, and your IP address will be added. You may need to refresh the page for this to take effect.

For your production cluster, you can add all of the same IP addresses as the development cluster has - although you may not need to add all of them, as connection with the production cluster should only be needed for initially seeding it, and after that only if things go wrong.

The production cluster will also need the IP address(es) used by your project's host. These are added to MongoDB in the 'Network Access' tab (under 'Security') by clicking the "ADD IP ADDRESS" button.

> [!NOTE]
> The method for obtaining IP addresses from hosts varies by provider, seek further information on getting them from your host's docs. 

### Connection Strings

The final step of connecting MongoDB to your project is to use connection strings.

Go to the "Clusters" tab of MongoDB Atlas, and next to the name you gave your development database will be a "Connect" button. Click this, then select the "Drivers" option. You can ignore steps 1 and 2; step three provides your connection string (ensure 'View full code sample' is toggled off).

Copy the connection string provided. Then, at the root of your project folder, create a file called ".env.development" and add your connection string in the formate below, replacing \<connection string> with your connection string:

```
URI = "<connection string>"
```

For your production cluster, follow the same initial steps to get your connection string. Add this to your host as an environmental variable called "URI". The host should also have an environmental variable called "NODE_ENV" with the value "production".

> [!NOTE]
> The directions for adding environmental variables vary by host, seek host's docs for advice on how to do this.

## Seeding

To seed your development cluster with dummy data from the ['development-data' folder](https://github.com/edthuman/gym-app-backend/tree/main/src/seeding/data/development-data), run the script: 

```
npm run seed
```

This script can be re-run at any time to return the database to its original state, allowing you to freely edit or delete items within it without any long-term consequences.

## Working on the API

You're now set up to begin working on the API!

To create a live version of the server that updates with changes made, run the command:

```
npm run app
```

This sets up a server using nodemon that allows you to make requests to your API via your browser or a platform like [Insomnia](https://insomnia.rest/).

## Testing

Testing for the API and utility functions has been carried out using Jest.

To run all existing tests, use the command:
```
npx jest
```

Any arguments given after 'jest' are used as search queries for file names. Tests from a specific file are run by providing the file's full name, or part of its name.

For instance, the tests in 'api.test.ts' will run if you use either of the following commands:
```
npx jest api.test.ts
npx jest api
```

Several arguments can be passed at once (separated by spaces) to run tests from several files, for example running both 'api.test.ts' 'users-utils.test.ts' by using:
```
npx jest api users
```

> [!NOTE]
> Jest run tests in all files with names that include the argument, not just the first match it finds.