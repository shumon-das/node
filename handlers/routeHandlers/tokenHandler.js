/**
 * Title: Token Handler
 * Description: handel user with this 
 * Author: monoranjan
 * Date: 11/12.2021
 */


 const reqeustData = require('../../lib/data'); 
 const {hash, parseJSON, createRandomString} = require('../../appHelpers/utilities');
 
 // module scaffolding
 const handler = {};
 
 handler.tokenHandler = (requestProperties, callback) => {
 
     const acceptedMethods = ['get', 'post', 'put', 'delete'];
 
     if (acceptedMethods.indexOf(requestProperties.method) > -1) {
 
         handler._token[requestProperties.method](requestProperties, callback);
 
     } else {
         callback(405,{
             "message": "Unknown Error"
         });
     }
 }
 
 handler._token = {};
 
 handler._token.post = (requestProperties, callback) => {
                          
    const username = typeof(requestProperties.body.userName) === 'string' &&
                          requestProperties.body.userName.trim().length > 0 
                          ? requestProperties.body.userName 
                          : false;  

    const password = typeof(requestProperties.body.password) === 'string' &&
                          requestProperties.body.password.trim().length > 0 
                          ? requestProperties.body.password 
                          : false; 
    if(username && password){
        reqeustData.read('users', username, (getError, userData) => {
            if(!getError){
                let hashedPassword = hash(password);
                let dbPassword = parseJSON(userData).password;
                if(hashedPassword === dbPassword){
                    let tokenId = createRandomString(20);
                    let expires = Date.now() * 60 * 60 * 1000;
                    let tokenObject = {
                        'username':username,
                        'id': tokenId,
                        expires 
                    };

                    // store the token into db
                    reqeustData.create('Tokens', tokenId, tokenObject, (tokenSaveError) => {
                        // TODO Fix token save error
                        if(!tokenSaveError){
                            callback(200, tokenObject);
                        }else{
                            callback(500, {
                                'error': 'get Internal server error ' + tokenSaveError
                            })
                        }
                    })
                }else{
                    callback(400,{
                        error: 'Invalid password'
                    });
                }
            }else{
                callback(500, {
                    'error': 'Internal server error \n ' + getError
                })
            }    
        })
        
    }else{
        callback(400,{
            error: 'Bad Request'
        });
    }
     
 }
 
 handler._token.get = (requestProperties, callback) => {
           
 }
 
 handler._token.put = (requestProperties, callback) => {
         
       
 }
 
 handler._token.delete = (requestProperties, callback) => {
    

 }
 
 
 module.exports = handler;