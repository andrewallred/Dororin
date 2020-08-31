const CmsService = require('./services/cms-service.js');
const QuickType = require('./services/quicktype-service.js');

const fs = require('fs');
const util = require('util');

// Convert fs.readFile into Promise version of same    
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

function loadQuery() {
    return readFile(__dirname + '/sample-queries/essays.graphql');
}

function writeClass(className, classDefinition) {
    writeFile(__dirname + '/generated-classes/' + className + '.cs', classDefinition);
}

async function main() {
    let data = await loadQuery();
    console.log('query data loaded from disk');
    let query = {
        query: data.toString(),
        operationName: "EssayQuery",
        variables: null
    };
    
    let queryResults = await CmsService.postQuery(query);

    let essay = queryResults.data.data;    

    const { lines: cSharpQuery } = await QuickType.quicktypeJSON(
         "csharp",
         "essay",
         JSON.stringify(essay)
       );

      console.log('Essay C# Class');
      //console.log(cSharpQuery.join("\n"));

      writeClass("Essay", cSharpQuery.join("\n"));
}

main();