/**
 * Title: not found handler
 * Description:
 * Author: monoranjan
 * Date: 21/11.2021
 */
// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log('Route Not Found');
    callback(404, {
        message: 'Requested URL was not found'
    })
}

module.exports = handler;