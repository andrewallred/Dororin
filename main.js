const CmsService = require('./services/cms-service.js');
const QuickType = require('./converters/quicktype-converter.js');

const fs = require('fs');
const util = require('util');
var _ = require('lodash');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function writeClass(className, classDefinition) {
    writeFile(__dirname + '/classes/' + className + '.cs', classDefinition);
}

function main() {

      fs.watch('./queries', (eventType, filename) => {
            console.log(filename + ' updated: ' + eventType);
            generateModelFromQuery(filename);
        });
}

async function generateModelFromQuery(file) {

    let modelName = file.replace('.graphql', '');
    
    let data = await readFile(__dirname + '/queries/' + file);;
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
        }

        console.log('converting query to c# class');
        const { lines: cSharpClassDefinition } = await QuickType.quicktypeJSON(
            "csharp",
            modelName,
            JSON.stringify(objectToConvert)
        );

        console.log('saving c# class');

        let classDefinition = cSharpClassDefinition.join("\n");
        writeClass(modelName, classDefinition);
    }
    else {
        console.log(queryResults.data.errors);
    }

    
}

main();