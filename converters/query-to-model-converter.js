module.exports = { generateModelFromQuery };

const CmsService = require('../services/cms-service.js');
const QuickType = require('./quicktype-converter.js');

const fs = require('fs');
const util = require('util');
const _ = require('lodash');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function generateModelFromQuery(file, folderQueries, folderModels, environment) {

    let modelName = file.replace('.graphql', '');
    
    let data = await readFile(folderQueries + file);;
    console.log('query data loaded from disk');
    let query = {
        query: data.toString(),
        operationName: null,
        variables: null
    };

    console.log('running query');

    let queryResults = await CmsService.postQuery(environment, query);

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
        classDefinition = classDefinition.replace('namespace QuickType', 'namespace Dororin.' + modelName);
        classDefinition = classDefinition.replace(/QuickType.Converter/g, 'Dororin.' + modelName + '.Converter');

        let modelFilePath = folderModels + modelName + '.cs';
        let writeModel = false;
        if (!fs.existsSync(modelFilePath)) {
            console.log('model does not exist');
            writeModel = true;
        }
        else {
            let existingModelDefinition = await readFile(modelFilePath.toString());
            writeModel = existingModelDefinition != classDefinition;
            if (writeModel) {
                console.log('existing model');
                console.log(existingModelDefinition);
                console.log('new model');
                console.log(classDefinition);
            }
        }
        if (writeModel) {
            console.log('writing the model');
            writeFile(modelFilePath, classDefinition);
        }
        else {
            console.log('not writing to disk, no changes to the model');
        }

        console.log('all done!');
    }
    else {
        console.log(queryResults.data.errors);
    }

}