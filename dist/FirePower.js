'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FirePower = undefined;

var _request = require('request');

var request = _interopRequireWildcard(_request);

var _url = require('url');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FirePower = function FirePower(ip, username, password) {
    var _this = this;

    _classCallCheck(this, FirePower);

    this.connect = function () {
        return new Promise(function (resolve, reject) {
            console.log('Trying to connect');
            var options = {
                uri: 'https://' + _this.ip + '/api/fmc_platform/v1/auth/generatetoken',
                json: true,
                method: 'POST',
                headers: {
                    Authorization: "Basic " + new Buffer(_this.username + ":" + _this.password).toString("base64")
                },
                strictSSL: false
            };
            request.post(options, function (error, response, body) {
                if (error) {
                    console.dir(error);
                    return reject(error);
                }
                _this.x_auth_token = response.headers['x-auth-access-token'];
                _this.x_refresh_token = response.headers['x-auth-refresh-token'];
                console.log(_this.x_auth_token + _this.x_refresh_token);
                return resolve();
            });
        });
    };

    this.addHostObject = function (optionParams) {
        return new Promise(function (resolve, reject) {
            console.log('Trying to add host object');
            var options = {
                uri: 'https://' + _this.ip + '/api/fmc_config/v1/domain/' + optionParams.domainUUID + '/object/hosts',
                json: true,
                method: 'POST',
                headers: {
                    'x-auth-access-token': _this.x_auth_token,
                    'x-auth-refresh-token': _this.x_refresh_token
                },
                body: {
                    "name": optionParams.objectName,
                    "type": "Host",
                    "value": optionParams.host,
                    "description": _this.commentPrefix + 'host ' + optionParams.host
                },
                strictSSL: false
            };
            request.post(options, function (error, response, body) {
                console.log('in req');
                if (error) {
                    console.log('in er1');
                    console.dir(error);
                    return reject(error);
                }
                if (body['error']) {
                    console.log('in er2');
                    console.dir(body['error']['messages']);
                    return reject(error);
                }
                return resolve(body.id);
            });
        });
    };

    this.blockOutgoingConnectionForHost = function (optionParams) {

        return new Promise(function (resolve, reject) {
            console.log('Trying to add access rule');
            var options = {
                uri: 'https://' + _this.ip + '/api/fmc_config/v1/domain/' + optionParams.domainUUID + '/policy/accesspolicies/' + optionParams.policyUUID + '/accessrules',
                json: true,
                method: 'POST',
                headers: {
                    'x-auth-access-token': _this.x_auth_token,
                    'x-auth-refresh-token': _this.x_refresh_token
                },
                body: {
                    "action": "BLOCK",
                    "enabled": true,
                    "type": "AccessRule",
                    "name": optionParams.accessRuleName,
                    "sendEventsToFMC": false,
                    "logFiles": false,
                    "logBegin": false,
                    "logEnd": false,
                    "sourceNetworks": {
                        "objects": [{
                            "type": "Host",
                            "name": optionParams.hostObjectName,
                            "id": optionParams.hostObjectID
                        }]
                    },
                    "newComments": [_this.commentPrefix]
                },
                strictSSL: false
            };

            request.post(options, function (error, response, body) {
                if (error) {
                    console.dir(error);
                    return reject(error);
                }
                if (body['error']) {
                    console.dir(body['error']['messages']);
                    return reject(error);
                }
                return resolve(body.id);
            });
        });
    };

    this.blockIncomingConnectionForHost = function (optionParams) {
        console.log(optionParams);
        // TODO: Handle Code duplication
        return new Promise(function (resolve, reject) {
            console.log('Trying to add access rule');
            var options = {
                uri: 'https://' + _this.ip + '/api/fmc_config/v1/domain/' + optionParams.domainUUID + '/policy/accesspolicies/' + optionParams.policyUUID + '/accessrules',
                json: true,
                method: 'POST',
                headers: {
                    'x-auth-access-token': _this.x_auth_token,
                    'x-auth-refresh-token': _this.x_refresh_token
                },
                body: {
                    "action": "BLOCK",
                    "enabled": true,
                    "type": "AccessRule",
                    "name": optionParams.accessRuleName,
                    "sendEventsToFMC": false,
                    "logFiles": false,
                    "logBegin": false,
                    "logEnd": false,
                    "destinationNetworks": {
                        "objects": [{
                            "type": "Host",
                            "name": optionParams.hostObjectName,
                            "id": optionParams.hostObjectID
                        }]
                    },
                    "newComments": [_this.commentPrefix]
                },
                strictSSL: false
            };

            request.post(options, function (error, response, body) {
                if (error) {
                    console.dir(error);
                    return reject(error);
                }
                if (body['error']) {
                    console.dir(body['error']['messages']);
                    return reject(error);
                }
                return resolve(body.id);
            });
        });
    };

    this.ip = ip;
    this.username = username;
    this.password = password;
    this.x_auth_token;
    this.x_refresh_token;
    this.commentPrefix = 'Automated';
};

exports.FirePower = FirePower;