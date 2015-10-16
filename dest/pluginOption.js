/// <reference path='../typings/tsd.d.ts' />
var Joi = require('joi');
var PluginOption = (function () {
    function PluginOption() {
    }
    return PluginOption;
})();
exports.PluginOption = PluginOption;
exports.scheme = Joi.object().keys({
    url: Joi.string().default(null),
    username: Joi.string().default(null),
    password: Joi.string().default(null),
    database: Joi.string().default(null),
    host: Joi.string().default('localhost'),
    port: Joi.number().integer().default('27017'),
    settings: Joi.object().optional()
});
//# sourceMappingURL=pluginOption.js.map