/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/03/16
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("projectSlideObjectListProcurer", ["slideObjectManager_global"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// LIST OF ALL SLIDE OBJECTS IN PROJECT
    ///////////////////////////////////////////////////////////////////////

    function doesEqualSplitNumberName(name, start) {
        return name.substr(0, start.length) === start &&
               !_extra.w.isNaN(name.substr(start.length, name.length));
    }

    function isSlideObject(slideObjectName, rawData) {
        if (rawData.hasOwnProperty("mdi")) {
            // We want to nip the 'c' off of the container's name.
            if (slideObjectName.charAt(slideObjectName.length - 1) === "c") {
                slideObjectName = slideObjectName.substr(0, slideObjectName.length - 1);
            }

            // # represents NUMBERS
            // If the name is: Slide####
            // Or: si####
            // Then we don't want this name on our list
            if (!doesEqualSplitNumberName(slideObjectName, "Slide") && !doesEqualSplitNumberName(slideObjectName, "si")) {
                return slideObjectName;
            }

        }
        return false;
    }


    var objectData;
    for (var objectName in _extra.captivate.allSlideObjectsData) {
        if (_extra.captivate.allSlideObjectsData.hasOwnProperty(objectName)) {

            objectData = _extra.captivate.allSlideObjectsData[objectName];
            objectName = isSlideObject(objectName, objectData);
            if (objectName) {
                _extra.slideObjects.projectSlideObjectNames[objectName] = true;
            }

        }
    }

}, _extra.CAPTIVATE);