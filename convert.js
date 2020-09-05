#! /usr/bin/env node

const queryToModelConverter = require('./converters/query-to-model-converter.js');
const argumentHelper = require('./helpers/argument-helper.js');

const fs = require('fs');
const path = require('path');

function main() {

    let folders = argumentHelper.getFolders();
    let environment = argumentHelper.getEnvironment();
    let file = argumentHelper.getFile();
    console.log(file);
    if (file != null && fs.existsSync(folders.folderQueries + file)) {
        queryToModelConverter.generateModelFromQuery(file, folders.folderQueries, folders.folderModels, environment);
    }
    else {
        console.log('please pass an existing file to dororin');
    }

}

main();