const fs = require('fs-extra');
const process = require('process'); 


exports.updateAngularConfig = function(projectName, workSpaceName, monetPath) {
    const createdProjectPath = getCreatedProjectPath(projectName, workSpaceName);
    fs.readFile(`${createdProjectPath}\\angular.json`,'utf8', (err, data) => {
        if (err) throw err;
        const json = data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
        const originalJsonData = JSON.parse(json);
        fs.readFile(`${monetPath}\\angular.json`,'utf8', (err, monetData) => {
            if (err) throw err;
            const monetJson = monetData.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
            const monetJsonData = JSON.parse(monetJson);

            const projects = Object.keys(monetJsonData.projects);
            const monetProjects = projects.filter(project => project.indexOf("@monet/") !== -1);
            const overwiteProjects = {};
            monetProjects.forEach(project => {
                overwiteProjects[project] = monetJsonData.projects[project]
            })
            originalJsonData.projects = Object.assign(originalJsonData.projects, overwiteProjects);
            fs.writeFile(
                `${createdProjectPath}\\angular.json`, 
                JSON.stringify(originalJsonData, null, 2), 
                function(err) {
                    if (err) throw err;
                }
            );
        });
    });
}

exports.updateTsConfig = function(projectName, workSpaceName, monetPath) {
    const createdProjectPath = getCreatedProjectPath(projectName, workSpaceName);
    const overwriteCompilerOptions = {
        strict: false,
        strictPropertyInitialization: false,
        target: "es2015",
        module: "esnext",
        noFallthroughCasesInSwitch: false,
        forceConsistentCasingInFileNames: false,
        noImplicitReturns: false,
        noImplicitReturns: false
    }
    const overwriteAngularCompilerOptions = {
        fullTemplateTypeCheck: true,
        enableI18nLegacyMessageIdFormat: true,
        strictTemplates: false,
    }
    fs.readFile(`${createdProjectPath}\\tsconfig.json`,'utf8', (err, data) => {
        if (err) throw err;
        const json = data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
        const originalJsonData = JSON.parse(json);
        
        fs.readFile(`${monetPath}\\tsconfig.json`,'utf8', (err, monetData) => {
            if (err) throw err;
            const monetJson = monetData.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
            const monetJsonData = JSON.parse(monetJson);
            overwriteCompilerOptions.paths = monetJsonData.compilerOptions.paths;
    
            //Modify the original file
            originalJsonData.compilerOptions = Object.assign(originalJsonData.compilerOptions, overwriteCompilerOptions);
            originalJsonData.angularCompilerOptions = Object.assign(originalJsonData.angularCompilerOptions, overwriteAngularCompilerOptions);
            
            fs.writeFile(
                `${createdProjectPath}\\tsconfig.json`, 
                JSON.stringify(originalJsonData, null, 2), 
                function(err) {
                    if (err) throw err;
                }
            );
        });
    });
}

exports.updatePackageJson = function(projectName, workSpaceName, monetPath) {
    const createdProjectPath = getCreatedProjectPath(projectName, workSpaceName);
    fs.readFile(`${createdProjectPath}\\package.json`,'utf8', (err, data) => {
        if (err) throw err;
        const json = data.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
        const originalJsonData = JSON.parse(json);
        fs.readFile(`${monetPath}\\package.json`,'utf8', (err, monetData) => {
            if (err) throw err;
            const monetJson = monetData.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);
            const monetJsonData = JSON.parse(monetJson);
           
            //Get the diff
            const scriptDiff = getDiff('scripts', originalJsonData, monetJsonData, projectName)
            const dependenciesDiff = getDiff('dependencies', originalJsonData, monetJsonData, projectName)
            const devDependenciesDiff = getDiff('devDependencies', originalJsonData, monetJsonData, projectName)
            //console.log(devDependenciesDiff)

            //Modify the original file
            originalJsonData.scripts = Object.assign(originalJsonData.scripts, scriptDiff);
            originalJsonData.dependencies = Object.assign(originalJsonData.dependencies, dependenciesDiff);
            originalJsonData.devDependencies = Object.assign(originalJsonData.devDependencies, devDependenciesDiff);
            
            fs.writeFile(
                `${createdProjectPath}\\package.json`, 
                JSON.stringify(originalJsonData, null, 2), 
                function(err) {
                    if (err) throw err;
                }
            );
        });
    });
}

const getCreatedProjectPath = (projectName, workSpaceName) => {
    return `${process.cwd()}/${projectName}/${workSpaceName}`;
}

const getDiff = (section, firstJson, secondJson, projectName) => {
    const res = {};
    if (firstJson && firstJson[section] &&
        secondJson && secondJson[section]) {
        const firstSection = Object.keys(firstJson[section]);
        const secondSection = Object.keys(secondJson[section]); 
        
        secondSection.forEach(seconKey => {
            const index = firstSection.indexOf(seconKey);
            if (index === -1 || 
                firstJson[section][firstSection[index]] !== secondJson[section][seconKey]) {
                let key = seconKey;
                let val = secondJson[section][seconKey];
                if (key.indexOf('demo-neutrino') !== -1){
                    const re = /demo-neutrino/gi;
                    key = key.replace(re, projectName);
                }
                if (val.indexOf('demo-neutrino') !== -1){
                    const re = /demo-neutrino/gi;
                    val = val.replace(re, projectName);
                }
                res[key] = val;
            }
        });
    }
    return res;
}