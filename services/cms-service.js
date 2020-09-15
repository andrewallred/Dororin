module.exports = { postQuery };

const https = require('https');
const axios = require('../node_modules/axios').default;

const cmsQueryUrlDev = 'https://webcmsdev.metmuseum.org/sitecore/api/graph/items/master';
const cmsQueryUrlStaging = 'https://webcmsstg.metmuseum.org/sitecore/api/graph/items/master';
const cmsQueryUrlProd = 'https://webcms.metmuseum.org/sitecore/api/graph/items/master';
const cmsQueryUrlLocal = 'http://webcmslocal/sitecore/api/graph/items/master';

async function postQuery(environment, query) {

    let results = null;
    
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    let cmsQueryUrl = null;
    if (environment == "Debug" || environment == "dev") {
      cmsQueryUrl = cmsQueryUrlLocal;
    }
    else if (environment == "webcmsdev" ||environment == null) {
      cmsQueryUrl = cmsQueryUrlDev;
    }
    else if (environment == "Staging" || environment == "stg") {
      cmsQueryUrl = cmsQueryUrlStaging;
    }
    else if (environment == "Release" || environment == "prod" || environment == "production" ) {
      cmsQueryUrl = cmsQueryUrlProd;
    }
    
    await instance.post(cmsQueryUrl, query).then((response) => {
        results = response;
      }, (error) => {
        console.log(error);
      });

    return results;

}