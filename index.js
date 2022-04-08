#!/usr/bin/env node

const shell = require("shelljs");
const inquirer = require("inquirer");
const process = require('process'); 
const updatePackage = require('./utils');

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
    const libsPath = `${monetPath}/libs`;
    const scriptsPath = `${monetPath}/scripts`;
    const monetSourcePath = `${monetPath}/projects/monet`;
    const scssPath = `${monetPath}/projects/demo-neutrino/src/assets/scss`;
    
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

    //4. Copy the Monet and Neutrino library
    shell.echo('4. Copy the Monet and Neutrino library');
    shell.cp('-R',`${libsPath}`,'.');

    //5. Copy the scripts
    shell.echo('5. Copy the scripts');
    shell.cp('-R',`${scriptsPath}`,'.');
    
    //6. Copy the Monet source code
    shell.echo('6. Copy the Monet source code');
    shell.cd('projects');
    shell.cp('-R',`${monetSourcePath}`,'.');
    shell.cd('..');
    
    //7. Copy global SCSS
    shell.echo('7. Copy global SCSS');
    shell.cd('projects');
    shell.cd(projectName);
    shell.cd('src/assets');
    shell.cp('-R',`${scssPath}`,'.');
    shell.cd('../../../..');

    //8. Update package.json
    shell.echo('8. Update package.json');
    updatePackage.updatePackageJson(`${projectName}`, monetPath)
    
    //9. Update tsconfig.json
    shell.echo('9. Update tsconfig.json');
    updatePackage.updateTsConfig(monetPath)
    
    //10. Update angular.json
    shell.echo('10. Update angular.json');
    updatePackage.updateAngularConfig(monetPath)

    //11. Update angular.json
    shell.echo('11. Update styles.scss');
    shell.cp('-R',`${__dirname}/templates/styles.scss`, `projects/${projectName}/src/`);

    //12. Create folders
    shell.echo('12. Create folders');
    shell.cd(`projects/${projectName}/src/app`);
    shell.mkdir('service');
    shell.mkdir('mock');
    shell.mkdir('auth');
    shell.mkdir('layout');
    shell.cd('service');
    shell.mkdir('data-dic');
    shell.mkdir('http');
    shell.mkdir('icon');
    shell.mkdir('template');
    shell.mkdir('nav');
    shell.cd('nav');
    shell.mkdir('nav-bar');
    shell.cd('../../..');

    //13. Create json files for the translation and code
    shell.echo('13. Create json files for the translation and code');
    shell.cd('assets');
    shell.mkdir('templates');
    shell.cd('templates');
    shell.mkdir('code');
    shell.mkdir('language');
    shell.cp('-R',`${__dirname}/templates/en.lang.template.json`, `code/`);
    shell.cp('-R',`${__dirname}/templates/public.code.template.json`, `language/`);
    shell.cd('../../../../../..');
    shell.pwd();

    //14. Update readme.md
    shell.echo('14. Update readme.md');
    shell.cp('-R',`${__dirname}/templates/readme.md`, `./`);

    
    shell.echo('New project has been created!');
});