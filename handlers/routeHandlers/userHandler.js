/**
 * Title: User Handler
 * Description: handel user with this 
 * Author: monoranjan
 * Date: 11/12.2021
 */


const reqeustData = require('../../lib/data'); 
const {hash, parseJSON} = require('../../appHelpers/utilities');

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
                          requestProperties.body.phoneNumber.trim().length === 12 
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
                                'message': 'Welcome, created a new user successfully'
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
    const userName = typeof(requestProperties.queryStringObject.username) === 'string' &&
                     requestProperties.queryStringObject.username 
                     ? requestProperties.queryStringObject.username 
                     : false; 
    if(userName){
        reqeustData.read('users', userName, (getUserError, u) => {
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
        callback(404,{
            'error':'Requested user was not found'
        });
    }                 
}

handler._users.put = (requestProperties, callback) => {
        
}

handler._users.delete = (requestProperties, callback) => {
        
}


module.exports = handler;