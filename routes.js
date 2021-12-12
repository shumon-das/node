/**
 * Title: Routes
 * Description: Application Routes
 * Author: monoranjan
 * Date: 21/11/2021
 */

// dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler
};

module.exports = routes;