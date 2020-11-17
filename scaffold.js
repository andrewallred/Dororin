#! /usr/bin/env node

const yargs = require('yargs');

const scaffoldBuilder = require('./tools/scaffold-builder.js');

const fs = require('fs');
const path = require('path');

const argv = yargs
    .command('scaffold', 'scaffold a Dororin component', {
        root: {
            description: 'the root folder to work from',
            alias: 'root',
            type: 'string',
        },
        name: {
            description: 'the name of the component',
            alias: 'name',
            type: 'string',
        },
        subQuery: {
            alias: 'subquery'
        }
    })
    .help()
    .alias('help', 'h')
    .argv;

function main() {

    console.log('scaffolding a component');
    let rootFolder = path.resolve(argv.root);
    if (rootFolder.charAt(rootFolder.length - 1) != '/') {
        rootFolder = rootFolder + '/';
    }

    let file = argv.name;
    let isSubquery = argv.subquery != undefined;
    console.log('root folder is ' + rootFolder);
    console.log('component name is ' + argv.name);
    console.log('isSubquery is ' + isSubquery);

    if (rootFolder != null) {
         scaffoldBuilder.scaffoldQueryModelAndView(file, rootFolder, isSubquery);        
    }
    else {
        console.log('please pass an existing root folder to dororin');
    }

}

main();