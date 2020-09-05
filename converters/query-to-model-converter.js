module.exports = { generateModelFromQuery };

const CmsService = require('../services/cms-service.js');
const QuickType = require('./quicktype-converter.js');

const fs = require('fs');
const util = require('util');
const _ = require('lodash');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const logDiagnosticInfo = false;

async function generateModelFromQuery(file, folderQueries, folderModels, environment) {

    let modelName = file.replace('.graphql', '');
    
    let data = await readFile(folderQueries + file);
    console.log('query data loaded from disk');
    let variablesData = null;
    let variablesFile = folderQueries + file.replace('graphql', 'gex');
    console.log(variablesFile);
    if (fs.existsSync(variablesFile)) {
        variablesData = await readFile(variablesFile);
        variablesData = variablesData.toString();
        console.log('query data loaded from disk')
        console.log(variablesData);
    }
    let query = {
        query: data.toString(),
        operationName: null,
        variables: variablesData
    };

    console.log('running query');

    let queryResults = await CmsService.postQuery(environment, query);

    if (logDiagnosticInfo) {
        console.log('query results for ' + modelName);
        console.log(queryResults.data.data);
    }

    console.log('query successful');

    let queryResultsData = queryResults.data.data;     
    queryResultsData = restructureObject(queryResultsData);
    if (logDiagnosticInfo) {
        console.log('restructured query results data');
        console.log(JSON.stringify(queryResultsData));
    }
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

        // note, we are using the OS specific new line here so that git doesn't get confused
        // may not work as we like cross-OS though...
        let classDefinition = cSharpClassDefinition.join(require('os').EOL);
        classDefinition = classDefinition.replace('namespace QuickType', 'namespace Dororin.' + modelName);
        classDefinition = classDefinition.replace(/QuickType.Converter/g, 'Dororin.' + modelName + '.Converter');

        let modelFilePath = folderModels + modelName + '.cs';
        let writeModel = false;
        if (!fs.existsSync(modelFilePath)) {
            console.log('model does not exist');
            writeModel = true;
        }
        else {
            let existingModelDefinition = await readFile(modelFilePath);
            writeModel = existingModelDefinition.toString() != classDefinition;
            if (logDiagnosticInfo && writeModel) {
                console.log('existing model');
                console.log(existingModelDefinition.toString());
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

function restructureObject(obj, key) {
    if (obj != null) {
        if (Object.keys(obj).length == 1 && Object.keys(obj)[0] == 'value') {
            obj = obj.value;
        }
        else if (Object.keys(obj).length > 0 && Object.keys(obj)[0] != '0') {
            Object.keys(obj).forEach(function(currentKey,index) {
                // key: the name of the object key
                // index: the ordinal position of the key within the object 
                if (obj[currentKey] != null && Array.isArray(obj[currentKey])) {
                    obj[currentKey].forEach(function(item) {
                        obj[currentKey][index] = restructureObject(item, currentKey);
                    });
                } else {
                    obj[currentKey] = restructureObject(obj[currentKey], currentKey);
                }
            });  
        }  
    }
    return obj;
}