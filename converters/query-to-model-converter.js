module.exports = { generateModelFromQuery };

const CmsService = require('../services/cms-service.js');
const QuickType = require('./quicktype-converter.js');

const fs = require('fs');
const util = require('util');
const _ = require('lodash');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const logDiagnosticInfo = true;

async function getJsonFromGraphQlAndRestructure(file, folderQueries, environment, sitecorePath) {
    let modelName = file.replace('.graphql', '');
    
    let data = await readFile(folderQueries + file);
    console.log('query data loaded from disk');
    let variablesData = null;
    let variablesFile = folderQueries + file.replace('graphql', 'gex');
    console.log(variablesFile);
    if (sitecorePath != null) {
        variablesData = JSON.stringify({
            sitecorePath: sitecorePath
        });
    }
    else if (fs.existsSync(variablesFile)) {
        variablesData = await readFile(variablesFile);
        variablesData = variablesData.toString();
        console.log('query data loaded from disk')
        console.log(variablesData);

        // check if the file was created on windows, and if so use substr to remove the first character
        console.log('first character (code) in variables file is ' + variablesData.charCodeAt(0))
        if (variablesData.charCodeAt(0) == 65279) {
            variablesData = variablesData.substr(1);
        }
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
        console.log(JSON.stringify(queryResults.data.data));
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
            console.error("could not find query results in data!!!");
            return null;
        }

        return objectToConvert;

    }

    return null;
}

async function generateModelFromQuery(file, folderQueries, folderModels, environment) {

    let modelName = file.replace('.graphql', '');

    let objectToConvert = await getJsonFromGraphQlAndRestructure(file, folderQueries, environment);

    if (objectToConvert != null) {

        // TODO refactor
        if (objectToConvert != null && objectToConvert.sections != null) {

            let folderSubqueries = folderQueries + 'subqueries/';

            for (let i = 0; i < objectToConvert.sections.length; i++) {

                if (objectToConvert.sections[i].template != null && objectToConvert.sections[i].template.name != null) {
                    let templateName = objectToConvert.sections[i].template.name.split(' ').join('');
                    let subqueryFile = templateName + '.graphql';
                    console.log('subqueryFile ' + subqueryFile);
                    if (fs.existsSync(folderSubqueries + subqueryFile)) {
                        let sitecorePath = objectToConvert.sections[i].id;
                        let subqueryObject = await getJsonFromGraphQlAndRestructure(subqueryFile, folderSubqueries, environment, sitecorePath);
                        console.log('subqueryObject ' + JSON.stringify(subqueryObject));
                        await convertJsonToCSharpClass(templateName, folderModels, subqueryObject);
                    }
                }                
            }
        }

        await convertJsonToCSharpClass(modelName, folderModels, objectToConvert);
    }
    else {
        console.log(queryResults.data.errors);
    }

}

async function convertJsonToCSharpClass(modelName, folderModels, objectToConvert) {
    
    let nameSpace = 'Dororin.' + modelName.charAt(0).toUpperCase() + modelName.slice(1);

    console.log('converting query to c# class');
    const { lines: cSharpClassDefinition } = await QuickType.quicktypeJSON(
        "csharp",
        modelName,
        nameSpace,
        JSON.stringify(objectToConvert)
    );

    console.log('saving c# class');

    // note, we are using the OS specific new line here so that git doesn't get confused
    // may not work as we like cross-OS though...
    let classDefinition = cSharpClassDefinition.join(require('os').EOL);
    
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

// TODO: possibly make this more abstract instead of only working in the "value" case
function restructureObject(obj) {
    if (obj != null) {
        if (Object.keys(obj).length == 1 && Object.keys(obj)[0] == 'value') {
            obj = obj.value;
        }
        else if (Object.keys(obj).length > 0 && Object.keys(obj)[0] != '0') {
            Object.keys(obj).forEach(function(currentKey,index) {
                // key: the name of the object key
                // index: the ordinal position of the key within the object 
                if (obj[currentKey] != null && Array.isArray(obj[currentKey])) {
                    let i = 0;
                    while (i < obj[currentKey].length) {
                        let item = obj[currentKey][i];
                        obj[currentKey][i] = restructureObject(item, currentKey);
                        i++;
                    }
                } else {
                    obj[currentKey] = restructureObject(obj[currentKey], currentKey);
                }
            });  
        }  
    }
    return obj;
}