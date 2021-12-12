/**
 * Title: 
 * Description:
 * Author: monoranjan
 * Date: 21/11/2021
 */
// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const {parseJSON} = require('../appHelpers/utilities');


// module scaffolding
const handler = {};

handler.handleRequestResponse = (req, res) => {

    // request 
    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g,'');
    const method = req.method.toLowerCase();
    const queryStringObject = parseUrl.query;
    const headers = req.headers;

    const decoder = new StringDecoder('utf-8');
    let data = '';

    const requestProperties = {
        parseUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headers
    };

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;


    req.on('data', (buffer) => {
        data += decoder.write(buffer);
    });

    req.on('end', () => {
        data += decoder.end();
        
        requestProperties.body = parseJSON(data);
        chosenHandler(requestProperties, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500;
            payload = typeof payload === 'object' ? payload : {};
    
            const payloadString = JSON.stringify(payload);
    
            // return final response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });

        req.on('data', (buffer) => {
            data += decoder.write(buffer);
        });
    
        req.on('end', () => {
            data += decoder.end();
    
            console.log(data);
            // response handle
            res.end('Hello world');
        });

    });

}


module.exports = handler;