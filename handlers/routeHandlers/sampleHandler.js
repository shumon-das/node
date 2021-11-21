/**
 * Title: 
 * Description:
 * Author: monoranjan
 * Date: 21/11.2021
 */
// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        message: 'some message from sample handler'
    })
}

module.exports = handler;