module.exports = { postQuery };

const axios = require('../node_modules/axios').default;

const cmsQueryUrl = 'https://webcms.metmuseum.org/sitecore/api/graph/items/master';

async function postQuery(query) {

    let results = null;
    
    await axios.post(cmsQueryUrl, query).then((response) => {
        results = response;
      }, (error) => {
        console.log(error);
      });

    return results;

}