module.exports = { getFolders, getEnvironment, getFile };

function getFolders() {
    // folder to look for queries
    let folderQueries = process.argv[2];
    // folder to save generated models
    let folderModels = process.argv[3];
    if (folderQueries != null) {

        if (folderQueries.charAt(folderQueries.length - 1) != '/') {
            folderQueries = folderQueries + '/';
        }

        if (folderModels == null || folderModels == '') {
            folderModels = './models/';
        }

        if (folderModels.charAt(folderModels.length - 1) != '/') {
            folderModels = folderModels + '/';
        }
    }

    return {
        folderQueries: folderQueries,
        folderModels: folderModels
    };
}

function getEnvironment() {
    let environment = process.argv[4];
    return environment;
}

function getFile() {
    let environment = process.argv[5];
    return environment;
}