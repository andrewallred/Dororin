module.exports = { getFolders };

function getFolders() {
    // folder to look for queries
    var folderQueries = process.argv[2];
    // folder to save generated models
    var folderModels = process.argv[3];
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