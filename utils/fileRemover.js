const fs = require('fs');
const path = require('path')
const fileRemover = (filename) => {
    fs.unlink(path.join(__dirname, '../uploads', filename), function(err){
        if(err && err.code == 'ENOET'){
            console.log(`Dont try to unexisting files ${filename}`)
        }
        else if(err){
            console.log(`Error occured while trying to remove file ${filename}`)
        }
        else{
            console.log(`removed filename ${filename}`)
        }
    });
}

module.exports = { fileRemover}