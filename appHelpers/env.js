/**
 * Title: 
 * Description:
 * Author: monoranjan
 * Date: 22/11/2021
 */
// application configuration
// app.config = {
//     port: 3000
// };
const env = {};

env.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'kjlkjlkjlk',
    maxChecks: 5
};

env.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'dfgdfhlkfd',
    maxChecks: 5
}

// datermine env
const currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging';

// export enviroment according to NODE_ENV
const exportEnv = typeof env[currentEnv] === 'object'
                       ? env[currentEnv] 
                       : env.staging ;


module.exports = exportEnv;