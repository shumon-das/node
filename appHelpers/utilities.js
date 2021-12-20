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

utilities.createRandomString = (strlength) => {
    let length = strlength;
    length = typeof strlength === 'number' && strlength > 0 ? strlength : false;

    if (length) {
        const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possiblecharacters.charAt(
                Math.floor(Math.random() * possiblecharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    if(length){
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz123456789';
        let output = '';
        for(let i=1; i<length; i+=1){
            const randomCharacter = possibleCharacters.charAt(
                Math.floor(Math.random() * possibleCharacters.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;
}

module.exports = utilities;