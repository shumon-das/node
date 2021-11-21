/**
 * Title: 
 * Description:
 * Author: 
 * Date: 20/11/2021
 */
// dependencies
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const {handleRequestResponse} = require('./appHelpers/requestResponseHelper');

// application object
const app = {};

// application configuration
app.config = {
    port: 3000
};


// create server for run
app.createServer = () => {
    const server = http.createServer(app.handleRequestResponse);
    server.listen(app.config.port, () => {
        console.log(`server listening to port ${app.config.port}`);
    });
}

// handling request and response
app.handleRequestResponse = handleRequestResponse;

// start our server
app.createServer();