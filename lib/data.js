/**
 * Title:
 * Description:
 * Author: monoranjan
 * Date: 23/11/2021
 */
// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data
lib.basedir = path.join(__dirname, '/../.data/');

// write data into file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (openError, filedescriptor) => {
        if(!openError && filedescriptor){
            const stringData = JSON.stringify(data);

            // write data into file and then close it
            fs.writeFile(filedescriptor, stringData,(writeError) => {
                if(!writeError){
                    fs.close(filedescriptor,(closeError) => {
                        if(!closeError){
                            callback(false)
                        }else{
                            callback("Error closing the new file " + closeError);
                        }
                    })
                }else{
                    callback("Error writing to new file " + writeError);
                }
            })
        } else{
            callback('already exists ' + openError);
        }
    })
}


// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir+dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    })
}

// update data
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir+dir}/${file}.json`, 'r+', (openErr, filedescriptor) => {
        if(!openErr && filedescriptor){
            // convert data to string
            const stringData = JSON.stringify(data);
        
            // truncate the file
            fs.ftruncate(filedescriptor, (truncateErr) => {
                if(!truncateErr){
                    fs.writeFile(filedescriptor, stringData, (writeErr) => {
                        if(!writeErr){
                            // close the file
                            fs.close(filedescriptor, (closeErr) => {
                                if(!closeErr){
                                    callback(false);
                                }else{
                                    callback("Error closing file");
                                }
                            })
                        }else{
                            callback("Error occurred, cannot writing file");
                        }
                    })
                }else{
                    callback("Error occurred, file not truncating");
                }
            })
        }else{
            console.log("Error occurred, File doesn't exists");
        }
    })
}

lib.delete = (dir, file, callback) => {
    // delete file 
    fs.unlink(`${lib.basedir+dir}/${file}.json`, (err) => {
        if(!err){
            callback(false);
        }else{
            callback("Error while deleting file");
        }
    })
}

module.exports = lib;