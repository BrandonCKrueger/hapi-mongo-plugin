var MongoDB = require('mongodb');
var Joi = require('joi');
var PluginOption = require('./pluginOption');
var MongoClient = MongoDB.MongoClient;
exports.register = function (server, pluginOptions, next) {
    Joi.validate(pluginOptions, PluginOption.scheme, function (error, options) {
        if (error) {
            server.log(['hapi-mongo-plugin', 'error'], error);
            return next(error);
        }
        if (!pluginOptions.url) {
            pluginOptions.url = 'mongodb://' +
                pluginOptions.username + ':' + pluginOptions.password + '@' +
                pluginOptions.host + ':' + pluginOptions.port + '/' + pluginOptions.database;
        }
        MongoClient.connect(pluginOptions.url, pluginOptions.settings, function (error, db) {
            if (error) {
                server.log(['hapi-mongo-plugin', 'error'], error);
                return next(error);
            }
            server.log(['hapi-mongo-plugin', 'info'], 'Connection to Mongo created for server' + server.connections);
            server.expose('Database', db);
            server.expose('MongoDB', MongoDB);
            next();
        });
    });
};
exports.register.attributes = {
    pkg: require('../package.json')
};
//# sourceMappingURL=index.js.map