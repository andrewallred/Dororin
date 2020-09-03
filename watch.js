#! /usr/bin/env node

const CmsService = require('./services/cms-service.js');
const QuickType = require('./converters/quicktype-converter.js');

const fs = require('fs');
const util = require('util');
var _ = require('lodash');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

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
                generateModelFromQuery(filename, folderQueries, folderModels);
            });
    }
    else {
        console.log('please pass an existing folder to dororin');
    }
    
}

async function generateModelFromQuery(file, folderQueries, folderModels) {

    let modelName = file.replace('.graphql', '');
    
    let data = await readFile(folderQueries + file);;
    console.log('query data loaded from disk');
    let query = {
        query: data.toString(),
        operationName: null,
        variables: null
    };

    console.log('running query');

    let queryResults = await CmsService.postQuery(query);

    console.log('query successful');

    let queryResultsData = queryResults.data.data; 
    if (queryResults.data.errors == null) {
        
        let objectToConvert = null;
        if (queryResultsData[_.camelCase(modelName)] != null) {
            objectToConvert = queryResultsData[_.camelCase(modelName)];
        } 
        else if (queryResultsData["search"] != null) {
            objectToConvert = queryResultsData.search;
        }
        else {
            // TODO throw an error here
            console.error("could not find query results in data!!!")
        }

        console.log('converting query to c# class');
        const { lines: cSharpClassDefinition } = await QuickType.quicktypeJSON(
            "csharp",
            modelName,
            JSON.stringify(objectToConvert)
        );

        console.log('saving c# class');

        let classDefinition = cSharpClassDefinition.join("\n");
        writeFile(folderModels + modelName + '.cs', classDefinition);

        console.log('all done!');
    }
    else {
        console.log(queryResults.data.errors);
    }

}

main();