#! /usr/bin/env node

const queryToModelConverter = require('./converters/query-to-model-converter.js');
const argumentHelper = require('./helpers/argument-helper.js');

const fs = require('fs');

function main() {

    let folders = argumentHelper.getFolders();
    if (folders.folderQueries != null && folders.folderModels 
        && fs.existsSync(folders.folderQueries) && fs.existsSync(folders.folderModels)) {
        console.log('dororin is now watching folder ' + folders.folderQueries)
        console.log('dororin is saving models to ' + folders.folderModels);

        fs.watch(folders.folderQueries, (eventType, filename) => {
                console.log(filename + ' updated: ' + eventType);
                queryToModelConverter.generateModelFromQuery(filename, folders.folderQueries, folders.folderModels);
            });
    }
    else {
        console.log('please pass an existing folder to dororin');
    }
    
}

main();