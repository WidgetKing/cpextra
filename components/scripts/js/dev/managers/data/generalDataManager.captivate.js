/*global _extra*/
_extra.registerModule("generalDataManager", ["softwareInterfacesManager", "dataTypeConverters", "createSlideObjectData"], function () {

    "use strict";

    var slideObjectDatas = {};

    _extra.dataManager = {

        "getSlideObjectDataByName": function (slideObjectName) {

            if (!slideObjectDatas.hasOwnProperty(slideObjectName)) {
                slideObjectDatas[slideObjectName] = _extra.dataManager.
                                                    createSlideObjectData(slideObjectName);
            }

            return slideObjectDatas[slideObjectName];

        },

        "createSlideObjectData": function (slideObjectName) {

            var type,
                data = {
                    "base": _extra.captivate.allSlideObjectsData[slideObjectName]
                };

            if (!data.base) {
                return null;
            }

            data.container = _extra.dataManager.getContainerData(slideObjectName);

            type = _extra.dataTypes.convertSlideObjectType(data.base.type, slideObjectName);

            return _extra.factories.createSlideObjectData(slideObjectName, data, type);

        },

        "getContainerData": function (slideObjectName) {
            var data = _extra.captivate.allSlideObjectsData[slideObjectName + "c"];

            if (!data) {
                data = _extra.captivate.allSlideObjectsData[slideObjectName + "sha"];
            }

            if (!data) {
                _extra.log("Could not find container data for: " + slideObjectName);
            }

            return data;
        },

        "getSlideObjectTypeByName": function (slideObjectName) {

            var data = _extra.captivate.allSlideObjectsData[slideObjectName];

            if (data) {

                return _extra.dataTypes.convertSlideObjectType(data.type, slideObjectName);

            }

            return _extra.w.NaN;
        },




        "getSlideObjectDataByID": function (id) {

            var data = _extra.captivate.api.getDisplayObjByCP_UID(id),
                name;

            if (data) {

                name = data.parentDivName;

            } else {

                name = getSlideObjectNameByID(id);

            }

            return _extra.dataManager.getSlideObjectDataByName(name);

        },


        "isHyperlink":function (name) {
            var data = _extra.captivate.allSlideObjectsData[name];

            return data.hasOwnProperty("accstr") &&
                data.hasOwnProperty("b") &&
                data.hasOwnProperty("oca") &&
                data.hasOwnProperty("ti") &&
                !data.hasOwnProperty("isCpObject") &&
                !data.hasOwnProperty("uid") &&
                !data.hasOwnProperty("mdi");

        }

    };

    function getSlideObjectNameByID(uid) {

        var slideObject;

        for (var name in _extra.captivate.allSlideObjectsData) {
            if (_extra.captivate.allSlideObjectsData.hasOwnProperty(name)) {

                slideObject = _extra.captivate.allSlideObjectsData[name];

                if (slideObject.uid === uid) {

                    return slideObject.dn;

                }

            }
        }

        return null;
    }

    //_extra.log(_extra.dataManager.getSlideObjectDataByName("Text_Entry_Box_1"));
    /*_extra.m = _extra.X.cp.model;
    _extra.X._extra.captivate.allSlideObjectsData = _extra.m;

    _extra.dataManager = {};
    _extra.dataManager.projectSlideObjectData = _extra.m.data;


    return function () {

    };*/
}, _extra.CAPTIVATE);