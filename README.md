# Hapi-Mongo-Plugin

Hapi-Mongo-Plugin is a Hapi plugin used to share a common MongoDB connection pool across the entire Hapi Server.

## Options
There are two ways to specify the MongoDB connection string:
* `url`: The complete MongoDB connection string (ex: `mongodb://username:password@host:port/database`)

If no URL is provided, the plugin will attempt to build one using the following parameters:
* `username`: Username used for authentication to the database
* `password`: Password used for authentication to the database
* `database`: Specific database to connect to
* `host`: Host location for the Mongo server
 * *Default*: Localhost
* `post`: Port the Mongo server is listening on
 * *Default*: 27017

Additionally:
* `settings`: *Optional*. Setting to be used by the native MongoDB driver as outlined by their [documentation](http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options)

## Exposed Objects
The plugin will expose the following objects pending successful connection:
* `Database`: The MongoDB object returned by the native MongoDB Driver
* `MongoDB`: The MongoDB library

## Sample Server
<script src="https://gist.github.com/BrandonCKrueger/1c4db489aec56cb3cea2.js"></script>