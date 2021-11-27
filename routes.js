/**
 * Title: Routes
 * Description: Application Routes
 * Author: monoranjan
 * Date: 21/11/2021
 */

// dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');

const routes = {
    sample: sampleHandler
};

module.exports = routes;