#! /usr/bin/env node

const queryToModelConverter = require('./converters/query-to-model-converter.js');

const fs = require('fs');

function main() {

    // folder to look for queries
    var folderQueries = process.argv[2];
    // folder to save generated models
    var folderModels = process.argv[3];
    if (folderQueries != null && fs.existsSync(folderQueries)) {

        if (folderQueries.charAt(folderQueries.length - 1) != '/') {
            folderQueries = folderQueries + '/';
        }

        console.log('dororin is now watching folder ' + folderQueries)

        if (folderModels == null || folderModels == '') {
            folderModels = './models/';
        }

        if (folderModels.charAt(folderModels.length - 1) != '/') {
            folderModels = folderModels + '/';
        }

        console.log('dororin is saving models to ' + folderModels);

        fs.watch(folderQueries, (eventType, filename) => {
                console.log(filename + ' updated: ' + eventType);
                queryToModelConverter.generateModelFromQuery(filename, folderQueries, folderModels);
            });
    }
    else {
        console.log('please pass an existing folder to dororin');
    }
    
}

main();