module.exports = { scaffoldQueryModelAndView }

const fs = require('fs');
const path = require('path');
const util = require('util');
const _ = require('lodash');

// Convert fs.readFile into Promise version of same 
const readFile = util.promisify(fs.readFile);   
const writeFile = util.promisify(fs.writeFile);

async function scaffoldQueryModelAndView(file, folderRoot, isSubquery) {

    let folderQueries = folderRoot + 'Queries/';
    let folderModels = folderRoot + 'QueryModels/';
    let folderViews = folderRoot + 'Views/Query/';

    if (isSubquery) {
        folderViews = folderRoot + 'Views/Shared/SubqueryComponents/';
    }
    
    console.log(__dirname);

    // write the query template
    let queryTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/query.graphql'));
    queryTemplate = queryTemplate.toString();
    queryTemplate = queryTemplate.replace(/queryName/g, _.camelCase(file));
    writeFile(folderQueries + file + '.graphql', queryTemplate);

    // write the gex template
    let gexTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/query.gex'));
    gexTemplate = gexTemplate.toString();
    writeFile(folderQueries + file + '.gex', gexTemplate);

    // write the model template
    let modelTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/model.cs'));
    modelTemplate = modelTemplate.toString();
    modelTemplate = modelTemplate.replace(/Model/g, file);
    writeFile(folderModels + file + '.cs', modelTemplate);

    // write the view template
    let viewTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/view.cshtml'));
    viewTemplate = viewTemplate.toString();
    viewTemplate = viewTemplate.replace(/Model/g, file);
    writeFile(folderViews + file + '.cshtml', viewTemplate);

}