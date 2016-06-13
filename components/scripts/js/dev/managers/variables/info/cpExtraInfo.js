/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/12/15
 * Time: 8:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("cpExtraInfo", ["infoVariableManager"], function () {

    "use strict";

    var versionInfo = {
        "suffix":"Version"
    };

    var buildInfo = {
        "suffix":"Build"
    };

    if (_extra.infoManager.registerInfoVariable(versionInfo)) {
        _extra.variableManager.setVariableValue(versionInfo.name, _extra.X.version);
    }

    if (_extra.infoManager.registerInfoVariable(buildInfo)) {
        _extra.variableManager.setVariableValue(buildInfo.name, _extra.X.build);
    }

});