/**
 * Title: 
 * Description:
 * Author: 
 * Date: 20/11/2021
 */
// dependencies
const http = require('http');
const {handleRequestResponse} = require('./appHelpers/requestResponseHelper');
const env = require('./appHelpers/env');
const data = require('./lib/data');

// application object
const app = {};

// call create file function
// data.create('Test', 'newFile',{name: "PHP", projectName: "single node project HaH!"}, (err) => { 
//     console.log("the error is ", err);
//  });

// call read file function
// data.read('Test', 'newFile',(err, data) => { 
//      err ? console.log(err) : console.log(data)
//  });


// call file update function
// data.update('Test', 'newFile',{name: "Node", projectName: "single node project now Edited"}, (err) => { 
//     console.log("the error is ", err);

//     // err ? console.log(err) : console.log(data)
//  });

// call delete file function
// data.delete('Test', 'newFile', (err) => {
//     console.log(err);
// });

// create server for run
app.createServer = () => {
    const server = http.createServer(app.handleRequestResponse);
    server.listen(env.port, () => {
        console.log(`server listening to port ${env.port}`);
    });
}

// handling request and response
app.handleRequestResponse = handleRequestResponse;

// start our server
app.createServer();
