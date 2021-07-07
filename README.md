# Dororin
 
Quick Proof of Concept to generate C# classes from GraphQL queries against a CMS.

![Dororin](dororin.jpeg)

## What does Dororin do?

Dororin converts GraphQL queries to C# classes, running the queries against a CMS (dev, staging, or prod) and then using QuickType to turn the results into models.

## History

Dororin was originally written as an experimental improvement project while at the Metropolitan Museum of Art and is shared here for anyone interested in alternative approaches to use of Sitecore's CMS product or creative uses of GraphQL.

## Using Dororin

You can install Dororin using NPM as so
```
npm install andrewallred/Dororin -g
```

Dororin currently has two commands, doro-watch and doro-batch.

### Doro-Watch
Doro-Watch watches the chosen folder for files changes and will create models from any updated graphql files.
```
doro-watch ../queries ../models Debug
```

### Doro-Batch
Doro-Batch creates models for all queries in the chosen folder.
```
doro-batch ../queries ../models Debug
```

In both examples above the Debug parameter tells Dororin to run its queries against the dev CMS (cmsQueryUrlDev in your .env file). The possible choices are: Debug, dev, Staging, stg, Release, prod, and production. If no value is passed Dororin will default to dev.

### Passing Variables to a Dororin Query

To ensure Dororin pulls the best possible data for your model, you can specify a variable file (.gec) that will be loaded and used when its associated query is run. Below you will see Essay.gec, which is used to specify the sitecorePath variable in the Essay.graphql query.

```
{
"sitecorePath": "/sitecore/path/here"
}
```

## Developing Dororin Locally

TODO
