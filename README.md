# Dororin
 
Quick Proof of Concept to generate C# classes from GraphQL queries.

![Dororin](dororin.jpeg)

## What does Dororin do?

Dororin converts graphql queries to C# classes, running the queries against a Met CMS (dev, staging, or prod) and then using QuickType to turn the results into models.

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

In both examples above the Debug parameter tells Dororin to run its queries against the dev CMS (https://webcmsdev.metmuseum.org). The possible choices are: Debug, dev, Staging, stg, Release, prod, and production. If no value is passed Dororin will default to using the dev CMS.

### Passing Variables to a Dororin Query

To ensure Dororin pulls the best possible data for your model, you can specify a variable file (.gec) that will be loaded and used when it's associated query is run. Below you will see Essay.gec, which is used to specify the sitecorePath variable in the Essay.graphql query.

```
{
"sitecorePath": "/sitecore/path/here"
}
```

## Developing Dororin Locally

TODO
