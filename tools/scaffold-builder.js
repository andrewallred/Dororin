module.exports = { scaffoldQueryModelAndView }

const fs = require('fs');
const path = require('path');
const util = require('util');
const _ = require('lodash');

// Convert fs.readFile into Promise version of same 
const readFile = util.promisify(fs.readFile);   
const writeFile = util.promisify(fs.writeFile);

async function scaffoldQueryModelAndView(file, folderRoot, projectFile, isSubquery) {

    let folderQueries = folderRoot + 'Queries/';
    let folderModels = folderRoot + 'QueryModels/';
    let folderViews = folderRoot + 'Views/Query/';
    projectFile = folderRoot + projectFile;

    if (isSubquery) {
        folderViews = folderRoot + 'Views/Shared/SubqueryComponents/';
        folderQueries = folderQueries + 'Subqueries/';
    }
    
    console.log(__dirname);

    // write the query template
    let queryTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/query.graphql'));
    queryTemplate = queryTemplate.toString();
    queryTemplate = queryTemplate.replace(/queryName/g, _.camelCase(file));
    writeFile(folderQueries + file + '.graphql', queryTemplate);

    if (!isSubquery) {        
        // write the gex template
        let gexTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/query.gex'));
        gexTemplate = gexTemplate.toString();
        writeFile(folderQueries + file + '.gex', gexTemplate);
    }

    // write the model template
    let modelTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/model.cs'));
    modelTemplate = modelTemplate.toString();
    modelTemplate = modelTemplate.replace(/Model/g, file);
    writeFile(folderModels + file + '.cs', modelTemplate);

    // write the view template
    let viewName = file;
    if (isSubquery) {
        viewName = '_' + file;
    }
    let viewTemplate = await readFile(path.resolve(__dirname, './scaffold-templates/view.cshtml'));
    viewTemplate = viewTemplate.toString();
    viewTemplate = viewTemplate.replace(/Model/g, file);
    writeFile(folderViews + viewName + '.cshtml', viewTemplate);

    if (fs.existsSync(projectFile)) {

        let projectXml = await readFile(projectFile);
        projectXml = projectXml.toString();

        let lastEmbeddedResourceLine = null;
        let lastQueryModel = null;
        let lastQueryView = null;
        let lastGex = null;

        // By lines
        var lines = projectXml.split('\n');
        for (let i = 0; i < lines.length; i++) {
            line = lines[i];        
            if (line.includes('EmbeddedResource')) {
                //console.log(line);
                lastEmbeddedResourceLine = line;
            }

            if (line.includes('QueryModels')) {
                //console.log(line);
                lastQueryModel = line;
            }

            if (line.includes('SubqueryComponents')) {
                //console.log(line);
                lastQueryView = line;
            }

            if (!isSubquery && line.includes('.gex')) {
                console.log(line);
                lastGex = line;
            }
        }

        if (lastEmbeddedResourceLine != null) {
            // this is super hacky, can improve later
            let embeddedFilePath = folderQueries.replace(folderRoot, '').replace(/\//g, '\\') + file + '.graphql';
            let newEmbeddedResource = lastEmbeddedResourceLine.split('\"')[0] + '\"' + embeddedFilePath + '\" />';
            projectXml = projectXml.replace(lastEmbeddedResourceLine, lastEmbeddedResourceLine + '\n' + newEmbeddedResource);
        }

        if (lastQueryModel != null) {
            // this is super hacky, can improve later
            let modelFilePath = folderModels.replace(folderRoot, '').replace(/\//g, '\\') + file + '.cs';
            let newModel = lastQueryModel.split('\"')[0] + '\"' + modelFilePath + '\" />';
            projectXml = projectXml.replace(lastQueryModel, lastQueryModel + '\n' + newModel);
        }

        if (lastQueryView != null) {
            // this is super hacky, can improve later    
            let viewFilePath = folderViews.replace(folderRoot, '').replace(/\//g, '\\') + viewName + '.cshtml';
            let newView = lastQueryView.split('\"')[0] + '\"' + viewFilePath + '\" />';
            projectXml = projectXml.replace(lastQueryView, lastQueryView + '\n' + newView);
        }

        console.log('not isSubquery ' + !isSubquery);
        console.log('last gex ' + lastGex);
        if (lastGex != null) {
            // this is super hacky, can improve later
            let gexFilePath = folderQueries.replace(folderRoot, '').replace(/\//g, '\\') + file + '.gex';
            let newGex = lastGex.split('\"')[0] + '\"' + gexFilePath + '\" />';
            projectXml = projectXml.replace(lastGex, lastGex + '\n' + newGex);
        }

        //console.log(projectXml);
        writeFile(projectFile, projectXml);

    }
    else {
        console.log('error! cannot find item groups to add embedded resource');
    }

    

}