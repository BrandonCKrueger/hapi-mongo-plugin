/// <reference path='../typings/tsd.d.ts' />
import Joi = require('joi');

export class PluginOption {
	url: string;
	username: string;
	password: string;
	database: string;
	host: string;
	port: number;
	settings: any;
}

export let scheme: Joi.ObjectSchema = Joi.object().keys({
	url: Joi.string().default(null),
	username: Joi.string().default(null),
	password: Joi.string().default(null),
	database: Joi.string().default(null),
	host: Joi.string().default('localhost'),
	port: Joi.number().integer().default('27017'),
	settings: Joi.object().optional()
});