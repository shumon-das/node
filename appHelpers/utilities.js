/**
 * Title: Utilities
 * Description:
 * Author: monoranjan
 * Date: 12/12/2021
 */

const crypto = require('crypto');
const utilities = {};
const env = require('./env');

utilities.parseJSON = (jsonString) => {
    let output;

    try {

        output = JSON.parse(jsonString);

    } catch {
        
        output = {};
    }

    return output;
}

// hash something or anything
utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0){
        const hash = crypto.createHmac('sha512', env.secretKey)
                         .update(str)
                         .digest('hex');
        return hash;
    }
    return false;
}


module.exports = utilities;