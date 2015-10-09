/*global _extra*/
_extra.registerModule("generalDataManager", ["softwareInterfacesManager", "dataTypeConverters", "createSlideObjectData"], function () {

    "use strict";

    _extra.dataManager = {

    };

    _extra.dataManager.getSlideObjectDataByName = function (name) {
        var data = {
            "base": _extra.captivate.allSlideObjectsData[name]
        };

        if (data.base) {
            data.container = _extra.captivate.allSlideObjectsData[name + "c"];
            return _extra.factories.createSlideObjectData(name, data, _extra.dataTypes.convertSlideObjectType(data.base.type));
        }
        return null;
    };


    //_extra.log(_extra.dataManager.getSlideObjectDataByName("Text_Entry_Box_1"));
    /*_extra.m = _extra.X.cp.model;
    _extra.X._extra.captivate.allSlideObjectsData = _extra.m;

    _extra.dataManager = {};
    _extra.dataManager.projectSlideObjectData = _extra.m.data;


    return function () {

    };*/
}, _extra.CAPTIVATE);