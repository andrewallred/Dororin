module.exports = { postQuery };

const https = require('https');
const axios = require('axios').default;

const cmsQueryUrlDev = process.env.cmsQueryUrlDev;
const cmsQueryUrlStaging = process.env.cmsQueryUrlStaging;
const cmsQueryUrlProd = process.env.cmsQueryUrlProd;
const cmsQueryUrlLocal = process.env.cmsQueryUrlLocal;

async function postQuery(environment, query) {

    let results = null;
    
    const instance = axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });

    let cmsQueryUrl = null;
    if (environment == 'Debug' || environment == 'dev') {
      cmsQueryUrl = cmsQueryUrlLocal;
    }
    else if (environment == 'webcmsdev' ||environment == null) {
      cmsQueryUrl = cmsQueryUrlDev;
    }
    else if (environment == 'Staging' || environment == 'stg') {
      cmsQueryUrl = cmsQueryUrlStaging;
    }
    else if (environment == 'Release' || environment == 'prod' || environment == 'production' ) {
      cmsQueryUrl = cmsQueryUrlProd;
    }

    console.log('cmsQueryUrl is ' + cmsQueryUrl);
    
    await instance.post(cmsQueryUrl, query).then((response) => {
        results = response;
      }, (error) => {
        console.log(error);
      });

    return results;

}