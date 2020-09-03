#! /usr/bin/env node

const queryToModelConverter = require('./converters/query-to-model-converter.js');
const argumentHelper = require('./helpers/argument-helper.js');

const fs = require('fs');
const path = require('path');

function main() {

    let folders = argumentHelper.getFolders();
    let environment = argumentHelper.getEnvironment();
    if (folders.folderQueries != null && folders.folderModels 
        && fs.existsSync(folders.folderQueries) && fs.existsSync(folders.folderModels)) {

        fs.readdir(folders.folderQueries, (err, files) => {
            files.forEach(file => {
                let ext = path.extname(folders.folderQueries + file);
                if (ext == '.graphql') {
                    console.log('converting ' + file);
                    queryToModelConverter.generateModelFromQuery(file, folders.folderQueries, folders.folderModels, environment);
                }
            });
        });

    }
    else {
        console.log('please pass an existing folder to dororin');
    }

}

main();