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
 
    const username = typeof(requestProperties.body.username) === 'string' &&
                          requestProperties.body.username.trim().length > 0 
                          ? requestProperties.body.username 
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
                        username,
                        id:tokenId,
                        expires 
                    };
                    console.log(tokenObject);
                    // store the token into db
                    reqeustData.create('Tokens', tokenId, tokenObject, (tokenSaveError) => {
                        console.log(tokenId);
                        // TODO Fix token save error
                        if(!tokenSaveError){
                            callback(200, tokenObject);
                        }else{
                            callback(500, {
                                'error': 'get Internal server error (tokenSaveError) ' + tokenSaveError
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
        const tokenId = typeof(requestProperties.queryStringObject.id) === 'string' &&
                        requestProperties.queryStringObject.id 
                        ? requestProperties.queryStringObject.id 
                        : false; 
        if(tokenId){
            reqeustData.read('Tokens', tokenId, (getTokenError, tokenData) => {
                const token = { ...parseJSON(tokenData) };
                if(!getTokenError && token){
                    callback(200, token)
                }else{
                    callback(404,{
                        'error':'Requested token was not found '+getTokenError
                    });
                }
            })
        }else{
            callback(404,{
                'error':'Requested tokenId was not found'
            });
        }        
 }
 
 handler._token.put = (requestProperties, callback) => {    
    const tokenId = typeof(requestProperties.body.id) === 'string' &&
                    requestProperties.body.id.trim().length === 20
                    ? requestProperties.body.id 
                    : false;   
    const extend = typeof requestProperties.body.extend === 'boolean' &&
                   requestProperties.body.extend === true
                   ? true
                   : false;

    if(tokenId && extend){
        reqeustData.read('Tokens', tokenId, (tokenNotFoundError, tokenData) => {
            const tokenObject = parseJSON(tokenData);
            if(tokenObject.expires > Date.now()){
                tokenObject.expires = Date.now() + 60 * 60 * 1000;

                reqeustData.update('Tokens', tokenId, tokenObject, (updateError) => {
                    if(!updateError){
                        callback(200)
                    }else{
                        callback(500,{
                            'error':'Update Error: '+updateError
                        }); 
                    }
                })
            }else{
                callback(400,{
                    'error':'Token already expired'
                });  
            }
        })

    }else{
        callback(400,{
            'error':'Something wrong with your request '+ tokenId +' '+extend
        });  
    }
 }
 
 handler._token.delete = (requestProperties, callback) => {
    const tokenId = typeof(requestProperties.queryStringObject.id) === 'string' &&
                    requestProperties.queryStringObject.id.trim().length === 20 
                    ? requestProperties.queryStringObject.id 
                    : false;

    if(tokenId){
        reqeustData.read('Tokens', tokenId, (dbError, tokenData) => {
            if(!dbError && tokenData){
                reqeustData.delete('Tokens', tokenId, (deleteError) => {
                    if(!deleteError){
                        callback(200, {
                            'message': 'Token deleted successfully'
                        })
                    }else{
                        callback(500, {
                            'error': `cannot delete ${tokenId} Tokens \n` + deleteError
                        })
                    }
                })
            }else{
                callback(500, {
                'error': 'token not found'
                })
            }
        })
    }else{
        callback(400, {
            'error': 'something went wrong'
        })
    }

 }
 
 handler._token.verify = (id, username, callback) => {
    reqeustData.read('Tokens', id, (verifyError, tokenData) => {
        if(!verifyError && tokenData){
            if(parseJSON(tokenData).username === username && parseJSON(tokenData).expires > Date.now()){
                callback(true);
            }else{
                callback(false);
            }
        }else{
            callback(false);
        }
    })
 }
 
 module.exports = handler;