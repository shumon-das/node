/**
 * Title: Check Handler
 * Description: handler to handel check 
 * Author: monoranjan
 * Date: 02/01/2022
 */


 const reqeustData = require('../../lib/data'); 
 const {parseJSON, createRandomString} = require('../../appHelpers/utilities');
 const tokenHandler = require('./tokenHandler');
 const { maxChecks } = require('../../appHelpers/env');
 
 // module scaffolding
 const handler = {};
 
 handler.checkHandler = (requestProperties, callback) => {
 
     const acceptedMethods = ['get', 'post', 'put', 'delete'];
 
     if (acceptedMethods.indexOf(requestProperties.method) > -1) {
 
         handler._check[requestProperties.method](requestProperties, callback);
 
     } else {
         callback(405,{
             "message": "Unknown Error"
         });
     }
 }
 
 handler._check = {};
 
 handler._check.post = (requestProperties, callback) => {
    let protocol = typeof(requestProperties.body.protocol) === 'string' &&
                   ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 
                   ? requestProperties.body.protocol
                   : false;

    let url = typeof(requestProperties.body.url) === 'string' &&
                   requestProperties.body.url.trim().length > 0 
                   ? requestProperties.body.url
                   : false; 

    let method = typeof(requestProperties.body.method) === 'string' &&
                 ['GET','POST','PUT','DELETE'].indexOf(requestProperties.body.method) > -1 
                 ? requestProperties.body.method
                 : false;

    let successCodes = typeof(requestProperties.body.successCodes) === 'object' &&
                       requestProperties.body.successCodes instanceof Array 
                       ? requestProperties.body.successCodes
                       : false; 

    let timeoutSeconds = typeof(requestProperties.body.timeoutSeconds) === 'number' &&
                         requestProperties.body.timeoutSeconds % 1 === 0 &&
                         requestProperties.body.timeoutSeconds >= 1 &&
                         requestProperties.body.timeoutSeconds <= 5  
                         ? requestProperties.body.timeoutSeconds
                         : false;     

    if(protocol && url && method && successCodes && timeoutSeconds){
        const token = typeof requestProperties.headers.token === 'string' 
                    ? requestProperties.headers.token
                    : false;
        reqeustData.read('Tokens', token, (tokenError, tokenData) => {
            if(!tokenError){
                let username = parseJSON(tokenData).username;
                reqeustData.read('users', username, (userDataError, userData) => {
                    if(!userDataError && userData){
                        tokenHandler._token.verify(token, username, (tokenIsValid) => {
                            if(tokenIsValid){
                                let userObject = parseJSON(userData);
                                let userChecks = typeof(userObject.checks) === 'object' &&
                                                 userObject.checks instanceof Array
                                                 ? userObject.checks
                                                 : [];
                                if(userChecks.length < maxChecks){
                                    const checkId = createRandomString(20);
                                    const checkObject = {
                                        id: checkId,
                                        username,
                                        protocol: protocol,
                                        url: url,
                                        method: method,
                                        successCodes: successCodes,
                                        timeoutSeconds: timeoutSeconds
                                    }
                                    
                                    reqeustData.create('Checks', checkId, checkObject, (saveError) => {
                                        if(!saveError){
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);
                                            // lets save new userdata
                                            reqeustData.create('users', username, userObject, (userDataSaveError) => {
                                                if(!userDataSaveError){
                                                    callback(200, checkObject);
                                                }else{
                                                    callback(500, {
                                                        error: 'Internel server error '+userDataSaveError
                                                    })
                                                }
                                            }) 
                                        }else{
                                            callback(500, {
                                                error: 'Internal server error'
                                            })
                                        }
                                    })
                                }else{
                                    callback(401, {
                                        error: 'Already reached maximum check limit'
                                    })
                                }                 
                            }else{
                                callback(403, {
                                    error: 'Invalid token '
                                })
                            }
                        })
                    }else{
                        callback(403, {
                            error: 'Requested user not found!'
                        })
                    }
                })
            }else{
                callback(403, {
                    error: 'Authentication failed'
                })
            }
        })
    }else{
        callback(400, {
            error: 'Bad Request'
        })
    }                                   
}
 
 handler._check.get = (requestProperties, callback) => {

 }
 
 handler._check.put = (requestProperties, callback) => {
    
 }
 
 handler._check.delete = (requestProperties, callback) => {

 }
 
 
 module.exports = handler;