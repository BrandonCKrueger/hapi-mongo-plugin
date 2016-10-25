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
[Gist](https://gist.github.com/BrandonCKrueger/1c4db489aec56cb3cea2)
```javascript
/// <reference path='../typings/tsd.d.ts' />
import Hapi = require('hapi');
import Boom = require('boom');

// creating the hapi server instance
let server: Hapi.Server = new Hapi.Server();

// adding a new connection that can be listened on
server.connection({
    port: process.env.PORT || 3000,
    host: 'localhost',
    labels: ['web']
});

// register routes
registerRoutes(server);

// register hapi-mongo-plugin
let database: any = {
	host: 'localhost',
	port: '27017'
};
server.register({ register: require('hapi-mongo-plugin'), options: database }, function(error: any): void {
    if (error) {
        console.log(error);
    } else {
      startServer(server);
    }
});


// private functions
function startServer(server: Hapi.Server): void {
  server.start(function (error: any): void {
    if (error) {
      throw error;
    }
    console.log('Server running at:', server.info.uri);
  });
}

function registerRoutes(server: Hapi.Server): void {
    server.route({
        'method'  : 'GET',
        'path'    : '/users/{id}',
        'handler' : usersHandler
    });

    function usersHandler(request: Hapi.Request, reply: Hapi.IReply): void {
        let db: any = request.server.plugins['hapi-mongo-plugin'].Database;
        let ObjectId: any = request.server.plugins['hapi-mongo-plugin'].MongoDB.ObjectID;

        db.collection('users').findOne({  '_id' : new ObjectId(request.params.id) }, function(err: any, result: any): any {
            if (err) {
                return reply(Boom.internal('Internal MongoDB error', err));
            }
            reply(result);
        });
    }
}
```

Edit 2
