exports.publicPaths = function(projectName, workspaceName){
    return [
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service/data-dic`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service/http`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service/icon`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service/template`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service/nav`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/service/nav/nav-bar`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/mock`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/auth`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/auth/service`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/layout`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/layout/service`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/templates`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/templates/code`,
    `${projectName}/${workspaceName}/projects/${projectName}/src/app/templates/language`
]}


exports.targetPathMap = function(monetPath, workdirPath){
    return {
        "monetLibsPath": `${monetPath}/libs`,
        "scriptsPath": `${monetPath}/scripts`,
        "monetProjectPath": `${monetPath}/projects/monet`,
        "styleScssPath": `${workdirPath}/templates/styles.scss`,
        "scssPath": `${monetPath}/projects/demo-neutrino/src/assets/scss`,
        "code": `${workdirPath}/templates/en.lang.template.json`,
        "language": `${workdirPath}/templates/public.code.template.json`,
        "readme": `${workdirPath}/templates/readme.md`
    }
};

exports.externalFilePathMap = function(projectName, workspaceName){
    return {
        "monetLibsPath": `${projectName}/${workspaceName}`,
        "scriptsPath": `${projectName}/${workspaceName}`,
        "monetProjectPath": `${projectName}/${workspaceName}/projects`,
        "styleScssPath": `${projectName}/${workspaceName}/projects/${projectName}/src/`,
        "scssPath": `${projectName}/${workspaceName}/projects/${projectName}/src/assets`,
        "code": `${projectName}/${workspaceName}/projects/${projectName}/src/app/templates/code`,
        "language": `${projectName}/${workspaceName}/projects/${projectName}/src/app/templates/language`,
        "readme": `${projectName}/${workspaceName}`
    }
};