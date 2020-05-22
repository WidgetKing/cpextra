const src = "components/scripts/js/dev/";

//// GLOBS
exports.cpExtraModulesForCaptivate = [
    src + "main.js",
    src + "**/!(*.storyline.js)"
];

///// FILE NAMES
exports.compiledCpExtraFileName = "Infosemantics_CpExtra.js";

///// DIRECTORIES
exports.devOutputDirectory = "builds/development";
exports.devOutputWidgetJSDirectory = "builds/development/wdgt_source/html5/scripts";

///// FILES PLUS DIRECTORIES
exports.devOutputCompiledCpExtra = exports.devOutputDirectory + "/" + exports.compiledCpExtraFileName;

