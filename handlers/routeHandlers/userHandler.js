/**
 * Title: User Handler
 * Description: handel user with this 
 * Author: monoranjan
 * Date: 11/12.2021
 */


const reqeustData = require('../../lib/data'); 
const {hash, parseJSON} = require('../../appHelpers/utilities');
const tokenHandler = require('./tokenHandler');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];

    if (acceptedMethods.indexOf(requestProperties.method) > -1) {

        handler._users[requestProperties.method](requestProperties, callback);

    } else {
        callback(405,{
            "message": "Unknown Error"
        });
    }
}

handler._users = {};

handler._users.post = (requestProperties, callback) => {
        
    const firstName = typeof(requestProperties.body.firstName) === 'string' &&
                          requestProperties.body.firstName.trim().length > 0
                          ? requestProperties.body.firstName 
                          : false;
 
    const lastName = typeof(requestProperties.body.lastName) === 'string' &&
                          requestProperties.body.lastName.trim().length > 0
                          ? requestProperties.body.lastName 
                          : false; 
                          
    const userName = typeof(requestProperties.body.userName) === 'string' &&
                          requestProperties.body.userName.trim().length > 0 
                          ? requestProperties.body.userName 
                          : false;  

    const phoneNumber = typeof(requestProperties.body.phoneNumber) === 'string' &&
                          requestProperties.body.phoneNumber.trim().length === 11 
                          ? requestProperties.body.phoneNumber 
                          : false; 

    const password = typeof(requestProperties.body.password) === 'string' &&
                          requestProperties.body.password.trim().length > 0 
                          ? requestProperties.body.password 
                          : false; 

    const termsCondition = typeof(requestProperties.body.termsCondition) === 'boolean'&&
                               requestProperties.body.termsCondition
                               ? requestProperties.body.termsCondition 
                               : false;     
   console.log(firstName+lastName+userName+phoneNumber+password+termsCondition)
    if(firstName && lastName && userName && phoneNumber && password && termsCondition){
        // check requested user already exists or not
            reqeustData.read('users', userName, (existError) => {
                if(existError){
                    // create an user object with request data
                    let userObject = {
                        firstName,
                        lastName,
                        userName,
                        phoneNumber,
                        password: hash(password),
                        termsCondition
                    }
                    
                    // store user to database
                    reqeustData.create('users', userName, userObject, (saveError) => {
                        if(!saveError){
                            callback(200,{
                                'message': `Welcome, created ${userName} user successfully`
                            });
                        }else{
                            callback(500,{
                                 'error': 'could not create user'
                            });
                        }
                    })
                }else{
                    callback(500,{
                         error: 'this username already exists'
                    })
                }
            });
    }else{
        callback(400,{
             error: 'Bad Request'
        });
    }
}

handler._users.get = (requestProperties, callback) => {
    // check the user valid or not
    const username = typeof(requestProperties.queryStringObject.username) === 'string' &&
                     requestProperties.queryStringObject.username 
                     ? requestProperties.queryStringObject.username 
                     : false; 
    if(username){
        
        let token = typeof(requestProperties.headers.token) === 'string'
                    ? requestProperties.headers.token
                    : false;
        tokenHandler._token.verify(token, username, (tokenId) => {
            if(tokenId){
                reqeustData.read('users', username, (getUserError, u) => {
                    const user = { ...parseJSON(u) };
                    if(!getUserError && user){
                        delete user.password;
                        callback(200, user)
                    }else{
                        callback(404,{
                            'error':'Requested user was not found'
                        });
                    }
                })
            }else{
                callback(403, {
                    'error': 'Authentication failed'
                })
            }
        })

    }else{
        callback(404,{
            'error':'Requested user was not found'
        });
    }                 
}

handler._users.put = (requestProperties, callback) => {
        
        const firstName = typeof(requestProperties.body.firstName) === 'string' &&
                          requestProperties.body.firstName.trim().length > 0
                          ? requestProperties.body.firstName 
                          : false;
 
        const lastName = typeof(requestProperties.body.lastName) === 'string' &&
                          requestProperties.body.lastName.trim().length > 0
                          ? requestProperties.body.lastName 
                          : false; 
                          
        const username = typeof(requestProperties.body.username) === 'string' &&
                          requestProperties.body.username.trim().length > 0 
                          ? requestProperties.body.username 
                          : false;  

        const phoneNumber = typeof(requestProperties.body.phoneNumber) === 'string' &&
                            requestProperties.body.phoneNumber.trim().length === 12 
                            ? requestProperties.body.phoneNumber 
                            : false; 

        const password = typeof(requestProperties.body.password) === 'string' &&
                          requestProperties.body.password.trim().length > 0 
                          ? requestProperties.body.password 
                          : false; 
                          
         if(username){

            if(firstName || lastName || phoneNumber || password){
                        
                let token = typeof(requestProperties.headers.token) === 'string'
                            ? requestProperties.headers.token
                            : false;
                tokenHandler._token.verify(token, username, (tokenId) => {
                    if(tokenId){
                        // get data from database
                        reqeustData.read('users', username, (userError, uData) => {
                            const userData = { ...parseJSON(uData) }
                            if(!userError){
                                if(firstName){
                                    userData.firstName = firstName;
                                }                        
                                if(lastName){
                                    userData.lastName = lastName;
                                }
                                if(phoneNumber){
                                    userData.phoneNumber = phoneNumber;
                                }
                                if(password){
                                    userData.password = hash(password);
                                }
                                // save data into database
                                reqeustData.update('users', username, userData, (putError) => {
                                    if(!putError){
                                        callback(200, {
                                            'message': username+' updated successfully'
                                        })
                                    }else{
                                        callback(500, {
                                            'error': 'internal server error'
                                        })
                                    }
                                })

                            }else{
                                callback(400, {
                                    'error':'sorry, something went wrong when try to get user data \n' + userError
                                })
                            }
                        })
                    }else{
                        callback(403, {
                            'error': 'Authentication failed'
                        })
                    }
                })

            }else{
                callback(400, {
                    'error':'sorry, something went wrong, please check your inputs, at least one field have to field'
                })
            }

         }else{
             callback(400, {
                 'error': 'invalid Credential'
             })
         }   
   
}

handler._users.delete = (requestProperties, callback) => {
    const username = typeof(requestProperties.queryStringObject.username) === 'string' &&
                     requestProperties.queryStringObject.username.trim().length > 0 
                     ? requestProperties.queryStringObject.username 
                     : false;

    if(username){
        let token = typeof(requestProperties.headers.token) === 'string'
                    ? requestProperties.headers.token
                    : false;
        tokenHandler._token.verify(token, username, (tokenId) => {
            if(tokenId){
                reqeustData.read('users', username, (dbError, userData) => {
                    if(!dbError && userData){
                        reqeustData.delete('users', username, (deleteError) => {
                            if(!deleteError){
                                callback(200, {
                                    'message': 'User deleted successfully'
                                })
                            }else{
                                callback(500, {
                                    'error': `cannot delete ${username} user \n` + deleteError
                                })
                            }
                        })
                    }else{
                        callback(500, {
                            'error': 'user not found'
                        })
                    }
                })
            }else{
                callback(403, {
                    'error': 'Authentication failed'
                })
            }
        })
    }else{
        callback(400, {
            'error': 'something went wrong'
        })
    }
}


module.exports = handler;