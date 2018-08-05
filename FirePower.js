import * as request from 'request';
import { resolve } from 'url';

class FirePower {
    constructor(ip,username,password) {
      this.ip=ip;
      this.username=username;
      this.password=password;
      this.x_auth_token;
      this.x_refresh_token;
      this.commentPrefix='Automated'
    }
    
    connect = () => {
        return new Promise((resolve,reject)=> {
            console.log('Trying to connect');
            const options = {
                uri: `https://${this.ip}/api/fmc_platform/v1/auth/generatetoken`,
                json: true,
                method: 'POST',
                headers: {
                Authorization : "Basic " + new Buffer(this.username + ":" + this.password).toString("base64")
                    },
                strictSSL: false
       };
       request.post(options, (error, response, body)=>{
        if (error) {
            console.dir(error);
            return reject(error);
          }
           this.x_auth_token=response.headers['x-auth-access-token']
           this.x_refresh_token=response.headers['x-auth-refresh-token']
           console.log(this.x_auth_token + this.x_refresh_token)
           return resolve()
       })
        }
    )}
    addHostObject = (optionParams) => {
        return new Promise((resolve,reject) =>
        {
            console.log('Trying to add host object');
            const options = {
                uri: `https://${this.ip}/api/fmc_config/v1/domain/${optionParams.domainUUID}/object/hosts`,
                json: true,
                method: 'POST',
                headers: {
                    'x-auth-access-token':this.x_auth_token,
                    'x-auth-refresh-token':this.x_refresh_token
                    },
                body:{
                        "name": optionParams.objectName,
                        "type": "Host",
                        "value": optionParams.host,
                        "description": this.commentPrefix + 'host ' + optionParams.host
                },
                strictSSL: false
            };
        request.post(options,(error,response,body)=>{
            console.log('in req')
            if (error) {
                console.log('in er1')
                console.dir(error);
                return reject(error);
              }
              if (body['error']) {
                  console.log('in er2')
                console.dir(body['error']['messages'])
                return reject(error);
              } 
            return resolve(body.id)
        })
        })
    }
    blockOutgoingConnectionForHost = (optionParams) => {
        
        return new Promise((resolve,reject) =>
        {
            console.log('Trying to add access rule');
            const options = {
                uri: `https://${this.ip}/api/fmc_config/v1/domain/${optionParams.domainUUID}/policy/accesspolicies/${optionParams.policyUUID}/accessrules`,
                json: true,
                method: 'POST',
                headers: {
                    'x-auth-access-token':this.x_auth_token,
                    'x-auth-refresh-token':this.x_refresh_token
                    },
                body:{
                    "action": "BLOCK",
                    "enabled": true,
                    "type": "AccessRule",
                    "name": optionParams.accessRuleName,
                    "sendEventsToFMC": false,
                    "logFiles": false,
                    "logBegin": false,
                    "logEnd": false,
                    "sourceNetworks": {
                          "objects": [
                              {
                                  "type": "Host",
                                  "name": optionParams.hostObjectName,
                                  "id": optionParams.hostObjectID
                              }
                          ]
                      },
                    "newComments": [
                      this.commentPrefix
                    ]
                },
                strictSSL: false
            };
        
        request.post(options,(error,response,body)=>{
            if (error) {
                console.dir(error);
                return reject(error);
              }
              if (body['error']) {
                  console.dir(body['error']['messages'])
                  return reject(error);
                } 
            return resolve(body.id)
        })
        })
    }
    blockIncomingConnectionForHost = (optionParams) => {
        console.log(optionParams)
        // TODO: Handle Code duplication
        return new Promise((resolve,reject) =>
        {
            console.log('Trying to add access rule');
            const options = {
                uri: `https://${this.ip}/api/fmc_config/v1/domain/${optionParams.domainUUID}/policy/accesspolicies/${optionParams.policyUUID}/accessrules`,
                json: true,
                method: 'POST',
                headers: {
                    'x-auth-access-token':this.x_auth_token,
                    'x-auth-refresh-token':this.x_refresh_token
                    },
                body:{
                    "action": "BLOCK",
                    "enabled": true,
                    "type": "AccessRule",
                    "name": optionParams.accessRuleName,
                    "sendEventsToFMC": false,
                    "logFiles": false,
                    "logBegin": false,
                    "logEnd": false,
                    "destinationNetworks": {
                          "objects": [
                              {
                                  "type": "Host",
                                  "name": optionParams.hostObjectName,
                                  "id": optionParams.hostObjectID
                              }
                          ]
                      },
                    "newComments": [
                      this.commentPrefix
                    ]
                },
                strictSSL: false
            };
        
        request.post(options,(error,response,body)=>{
            if (error) {
                console.dir(error);
                return reject(error);
              }
              if (body['error']) {
                  console.dir(body['error']['messages'])
                  return reject(error);
                } 
            return resolve(body.id)
        })
        })
    }
  }
  export {FirePower}
  