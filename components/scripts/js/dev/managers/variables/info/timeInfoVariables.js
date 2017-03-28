/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 6/06/16
 * Time: 11:12 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("timeInfoVariables", ["infoVariableManager", "movieStatusManager", "doubleDidgitPreferences"], function () {

    "use strict";

    var totalVariables = ["ProjectTotalHours", "ProjectTotalMinutes", "ProjectTotalSeconds"],
        elapsedVariables = ["ProjectElapsedHours", "ProjectElapsedMinutes", "ProjectElapsedSeconds"],
        varInfos = {

        };

    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE METHODS
    ///////////////////////////////////////////////////////////////////////
    function getTimeFromFrames(frames) {

        var r = _extra.w.Math.floor,
            seconds = r(frames / _extra.movieStatus.FPS),
            minutes = r(seconds / 60),
            hours = r(minutes / 60);

        seconds -= minutes * 60;
        minutes -= hours * 60;

        return {
            "seconds":seconds,
            "minutes":minutes,
            "hours":hours
        };
    }

    function setVariableBySuffix(suffix, value) {

        var info = varInfos[suffix];

        if (info.exists) {

            // CHECK FOR DOUBLE DIDGITS
            if (_extra.preferences.doubleDidgits[suffix] &&
                value < 10) {

                value = "0" + value;

            }

            _extra.variableManager.setVariableValue(info.name, _extra.w.String(value));
        }

    }

    function registerVariables(variablesArray) {

        var variablesExist = false,
            varInfo,
            varName;

        for (var i = 0; i < variablesArray.length; i += 1) {

            // Register all the time info variables
            varName = variablesArray[i];

            varInfo = {
                "suffix":varName
            };

            varInfo.exists = _extra.infoManager.registerInfoVariable(varInfo);

            if (varInfo.exists) {
                variablesExist = true;
            }

            varInfos[varName] = varInfo;
        }

        return variablesExist;
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// PUBLIC METHODS
    ///////////////////////////////////////////////////////////////////////
    _extra.preferences.calculateTotalProjectTime = function () {

        var time = getTimeFromFrames(_extra.movieStatus.totalFrames);

        setVariableBySuffix("ProjectTotalSeconds", time.seconds);
        setVariableBySuffix("ProjectTotalMinutes", time.minutes);
        setVariableBySuffix("ProjectTotalHours", time.hours);
    };

    _extra.preferences.calculateElapsedProjectTime = function () {

        var time = getTimeFromFrames(_extra.movieStatus.currentFrame);

        setVariableBySuffix("ProjectElapsedSeconds", time.seconds);
        setVariableBySuffix("ProjectElapsedMinutes", time.minutes);
        setVariableBySuffix("ProjectElapsedHours", time.hours);
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Total Time
    ///////////////////////////////////////////////////////////////////////
    if (registerVariables(totalVariables)) {

        _extra.preferences.calculateTotalProjectTime();

    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Elapsed Time
    ///////////////////////////////////////////////////////////////////////
    if (registerVariables(elapsedVariables)) {

        _extra.eventManager.eventDispatcher.addEventListener("newframe", function () {

            _extra.preferences.calculateElapsedProjectTime();

        });

    }




});