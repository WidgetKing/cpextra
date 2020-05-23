const src = "components/scripts/js/dev/";

//// GLOBS
exports.cpExtraModulesForCaptivate = [
    src + "main.js",
    src + "**/!(*.storyline.js)"
];

exports.devWidgetFolderGlob = "builds/development/wdgt_source/**";

///// FILE NAMES
exports.compiledCpExtraFileName = "Infosemantics_CpExtra.js";
exports.widgetPropertieSWFName = "Infosemantics_CPExtra_AS3";
exports.widgetFileName = "Infosemantics_CpExtra.wdgt";

///// DIRECTORIES
exports.productionOutputDirectory = "builds/production";

exports.devOutputDirectory = "builds/development";
exports.devOutputWidgetJSDirectory = "builds/development/wdgt_source/html5/scripts";
exports.devOutputWidgetSWFDirectory = "builds/development/wdgt_source/swf"
exports.devOutputWidgetRoot = "builds/development/wdgt_source";

///// FILES PLUS DIRECTORIES
exports.devOutputCompiledCpExtra = exports.devOutputDirectory + "/" + exports.compiledCpExtraFileName;
exports.widgetPropertiesSWF = "components/swf/bin/captivateextra.swf";
exports.versionJSONFile = "components/scripts/json/version.json";
exports.widgetDescriptionXML = "components/scripts/xml/description.xml";
