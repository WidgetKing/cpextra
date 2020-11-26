const src = "components/scripts/js/dev/";

const mainCpExtraFile = src + "main.js",
    restCpExtraFiles = src + "**/!(*.storyline.js)";
//// GLOBS
exports.cpExtraModulesForCaptivate = [mainCpExtraFile, restCpExtraFiles];

exports.devWidgetFolderGlob = "builds/development/wdgt_source/**";
exports.effectsSourceFolderGlob = "components/scripts/xml/Effects/**";
exports.testsCpExtraGlob =
    "tests/output/**/@(captivate_extra.js|Infosemantics_CpExtra.js)";

///// FILE NAMES
exports.compiledCpExtraFileName = "Infosemantics_CpExtra.js";
exports.widgetPropertieSWFName = "Infosemantics_CPExtra_AS3";
exports.widgetFileName = "Infosemantics_CpExtra.wdgt";

exports.unitTestsSetupFileName = "testsSetup.js";
exports.unitTestsTeardownFileName = "testsTeardown.js";

///// DIRECTORIES
exports.productionOutputDirectory = "builds/production";
exports.productionEffectsOutputDirectory = "builds/production/Effects";
exports.testDirectory = "tests/output";

exports.devOutputDirectory = "builds/development";
exports.devOutputWidgetJSDirectory =
    "builds/development/wdgt_source/html5/scripts";
exports.devOutputWidgetSWFDirectory = "builds/development/wdgt_source/swf";
exports.devOutputWidgetRoot = "builds/development/wdgt_source";

///// FILES PLUS DIRECTORIES
exports.devOutputCompiledCpExtra =
    exports.devOutputDirectory + "/" + exports.compiledCpExtraFileName;
exports.widgetPropertiesSWF = "components/swf/bin/captivateextra.swf";
exports.versionJSONFile = "components/scripts/json/version.json";
exports.widgetDescriptionXML = "components/scripts/xml/description.xml";
