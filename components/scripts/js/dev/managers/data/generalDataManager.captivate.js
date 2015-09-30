/*global _extra*/
_extra.registerModule("generalDataManager", ["softwareInterfacesManager", "globalSlideObjectTypes", "createSlideObjectData"], function () {

    "use strict";

    var projectData = _extra.captivate.model.data;
    /*
    submitted for your interest.
    This data should be gradually migrated into the function bellow.
    var captivateSlideObjectTypes = {
        "CLOSE_PATH":4,
        "CLICK_BOX":13,
        "HIGHLIGHT_BOX":14,
        "CAPTION":19,
        "TEXT_ENTRY_BOX":24, // Implemented
        "TEXT_ENTRY_BOX_SUBMIT_BUTTON":75,
        "BUTTON":177
    };
     */

    function convertCaptivateDataTypesToGlobalDataTypes(cpType) {
        switch (cpType) {
            case 24 :
                return _extra.slideObjectsTypes.TEXT_ENTRY_BOX;
                break;
        }
    }

    _extra.dataManager = {

    };

    _extra.dataManager.getSlideObjectDataByName = function (name) {
        var data = {
            "base": projectData[name]
        };

        if (data.base) {
            data.container = projectData[name + "c"];
            return _extra.factories.createSlideObjectData(name, data, convertCaptivateDataTypesToGlobalDataTypes(data.base.type));
        }
        return null;
    };

    _extra.log(_extra.dataManager.getSlideObjectDataByName("Text_Entry_Box_1"));
    /*_extra.m = _extra.X.cp.model;
    _extra.X.projectData = _extra.m;

    _extra.dataManager = {};
    _extra.dataManager.projectSlideObjectData = _extra.m.data;


    return function () {

    };*/
}, _extra.CAPTIVATE);