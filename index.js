#!/usr/bin/env node

const shell = require("shelljs");
const inquirer = require("inquirer");
const process = require('process'); 
const updatePackage = require('./utils');
const configs = require('./configs');

const questions = [
    {
        type: "input",
        name: "projectName",
        message: "Please enter your new project's name.",
        default: "monet-demo"
    },
    {
        type: "input",
        name: "monetPath",
        message: "Please enter the absolute path of the monet-demo workspace.",
        default: ""
    }
];

//Check if the Angular CLI has been installed
if (!shell.which('ng')) {
    shell.echo('Sorry, this script requires Angular CLI');
    shell.exit(1);
}
  
inquirer.prompt(questions).then(answers => {
    const { projectName, monetPath } = answers;

    if (monetPath.length === 0) {
        shell.echo('Sorry, the absolute path of Monet workspace should be provided');
        shell.exit(1);
    }

    const workSpaceName = `${projectName}-workspace`;
    const externalFilePathMap = configs.externalFilePathMap(projectName, workSpaceName);
    const targetPathMap = configs.targetPathMap(monetPath, __dirname);
    
    //1. Create the project folder
    shell.echo('1. Create the project folder');
    shell.mkdir(projectName);
    shell.cd(projectName);

    //2. Create the workspace
    shell.echo('2. Create the workspace');
    shell.exec(`ng new ${workSpaceName} --create-application false`);
    shell.cd(workSpaceName);
    
    //3. Create the application
    shell.echo('3. Create the application');
    shell.exec(`ng generate application ${projectName} --routing --style scss`);

    // 4. Create folders
    shell.echo('4. Create folders');
    shell.cd('../..');
    configs.publicPaths(projectName, workSpaceName).map(path => {
        shell.mkdir(path)
    })

    //5. Copy the Monet and Neutrino library
    shell.echo('5. Copy the Monet and Neutrino library');
    shell.cp('-R', targetPathMap.monetLibsPath, externalFilePathMap.monetLibsPath);

    //6. Copy the scripts
    shell.echo('6. Copy the scripts');
    shell.cp('-R', targetPathMap.scriptsPath,  externalFilePathMap.scriptsPath);

    //7. Copy the Monet source code
    shell.echo('7. Copy the Monet source code');
    shell.cp('-R', targetPathMap.monetProjectPath, externalFilePathMap.monetProjectPath);
    
    //8. Copy global SCSS
    shell.echo('8. Copy global SCSS');
    shell.cp('-R', targetPathMap.scssPath, externalFilePathMap.scssPath);

    //9. Update package.json
    shell.echo('9. Update package.json');
    updatePackage.updatePackageJson(projectName, workSpaceName, monetPath)
    
    //10. Update tsconfig.json
    shell.echo('10. Update tsconfig.json');
    updatePackage.updateTsConfig(projectName, workSpaceName, monetPath)
    
    //11. Update angular.json
    shell.echo('11. Update angular.json');
    updatePackage.updateAngularConfig(projectName, workSpaceName, monetPath)

    //12. Update angular.json
    shell.echo('12. Update styles.scss');
    shell.cp('-R', targetPathMap.styleScssPath, externalFilePathMap.styleScssPath);

    //13. Create json files for the translation and code
    shell.echo('13. Create json files for the translation and code');
    shell.cp('-R', targetPathMap.code, externalFilePathMap.code);
    shell.cp('-R', targetPathMap.language, externalFilePathMap.language);

    //14. Update readme.md
    shell.echo('14. Update readme.md');
    shell.cp('-R', targetPathMap.readme, externalFilePathMap.readme);
    shell.echo('New project has been created!');
});