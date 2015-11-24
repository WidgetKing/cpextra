/*global _extra*/
_extra.registerModule("generalDataManager", ["softwareInterfacesManager", "dataTypeConverters", "createSlideObjectData"], function () {

    "use strict";

    _extra.dataManager = {

        "getSlideObjectDataByName": function (slideObjectName) {
            var data = {
                "base": _extra.captivate.allSlideObjectsData[slideObjectName]
            };

            if (data.base) {
                data.container = _extra.captivate.allSlideObjectsData[slideObjectName + "c"];
                return _extra.factories.createSlideObjectData(slideObjectName, data, _extra.dataTypes.convertSlideObjectType(data.base.type));
            }
            return null;
        },
        "getSlideObjectTypeByName": function (slideObjectName) {

            var data = _extra.captivate.allSlideObjectsData[slideObjectName];

            if (data) {

                return _extra.dataTypes.convertSlideObjectType(data.type);

            }

            return NaN;
        }
    };

    //_extra.log(_extra.dataManager.getSlideObjectDataByName("Text_Entry_Box_1"));
    /*_extra.m = _extra.X.cp.model;
    _extra.X._extra.captivate.allSlideObjectsData = _extra.m;

    _extra.dataManager = {};
    _extra.dataManager.projectSlideObjectData = _extra.m.data;


    return function () {

    };*/
}, _extra.CAPTIVATE);