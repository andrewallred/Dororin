#! /usr/bin/env node

const queryToModelConverter = require('./converters/query-to-model-converter.js');
const argumentHelper = require('./helpers/argument-helper.js');

const fs = require('fs');

function main() {

    let folders = argumentHelper.getFolders();
    if (folders.folderQueries != null && folders.folderModels 
        && fs.existsSync(folders.folderQueries) && fs.existsSync(folders.folderModels)) {

        fs.readdir(folders.folderQueries, (err, files) => {
            files.forEach(file => {
                console.log('converting ' + file);
                queryToModelConverter.generateModelFromQuery(file, folders.folderQueries, folders.folderModels);
            });
        });

    }
    else {
        console.log('please pass an existing folder to dororin');
    }

}

main();