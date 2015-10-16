/// <reference path='../typings/tsd.d.ts' />
import Hapi = require('hapi');
import MongoDB = require('mongodb');
import Joi = require('joi');
import PluginOption = require('./pluginOption');

let MongoClient: any = MongoDB.MongoClient;

exports.register = function(server: Hapi.Server, pluginOptions: PluginOption.PluginOption, next: (error?: string) => void): void {

	Joi.validate(pluginOptions, PluginOption.scheme, function(error: any, options: any): void {

		if (error) {
			server.log(['hapi-mongo-plugin', 'error'], error);
			return next(error);
		}

		if (!pluginOptions.url) {
			pluginOptions.url = 'mongodb://';
			if (pluginOptions.username && pluginOptions.password) {
				pluginOptions.url += pluginOptions.username + ':' + pluginOptions.password + '@';
			}
			pluginOptions.url += pluginOptions.host + ':' + pluginOptions.port + '/' + pluginOptions.database;
		}

		MongoClient.connect(pluginOptions.url, pluginOptions.settings, function(error: any, db: MongoDB.Db): void {

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