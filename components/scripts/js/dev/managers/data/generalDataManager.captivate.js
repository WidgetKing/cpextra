/*global _extra*/
_extra.registerModule("generalDataManager", ["utils", "softwareInterfacesManager", "dataTypeConverters", "createSlideObjectData"], function () {

    "use strict";

    var slideObjectDatas = {};

    _extra.dataManager = {

		"getSlideObjectDataByQuery": function (query) {
		
			var list = _extra.slideObjects.projectSlideObjectNames;
			var result = _extra.queryList(
				query, list, "@"
			)

			if (result === null) return null;

			return _extra.utils.map(_extra.dataManager.createSlideObjectData, result);

		},

        "getSlideObjectDataByName": function (slideObjectName) {

            if (!slideObjectDatas.hasOwnProperty(slideObjectName)) {
                slideObjectDatas[slideObjectName] = _extra.dataManager.
                                                    createSlideObjectData(slideObjectName);
            }

            return slideObjectDatas[slideObjectName];

        },

        "createSlideObjectData": function (slideObjectName) {

            var type,
                base,
                data,
                container;

            base = _extra.captivate.allSlideObjectsData[slideObjectName];

            if (!base) {

                return null;

            } else if (_extra.dataManager.isContainerData(slideObjectName, base)) {

                // Start the method again with the correct name;
                slideObjectName = _extra.dataManager.removeContainerSuffix(slideObjectName);
                return _extra.dataManager.createSlideObjectData(slideObjectName);

            }

            type = _extra.dataTypes.convertSlideObjectType(base.type, slideObjectName);
            container = _extra.dataManager.getContainerData(slideObjectName, type);

            data = {
                "base":base,
                "container": container
            };

            return _extra.factories.createSlideObjectData(slideObjectName, data, type);

        },

        "isContainerData": function (name, data) {

            var nonSuffixName = _extra.dataManager.removeContainerSuffix(name);

            if (data.hasOwnProperty("b") &&
                nonSuffixName !== name &&
                _extra.captivate.allSlideObjectsData.hasOwnProperty(nonSuffixName)) {

                return true;

            }

            return false;
        },

        "removeContainerSuffix": function (name) {

            var suffix = "c", // TODO: Make this work for Short Answer questions TEBs as well
                startIndex = name.length - suffix.length,
                endOfName = name.substring(startIndex, name.length);

            if (endOfName === suffix) {
                return name.substring(0, startIndex);
            }

            return name;

        },

        "getContainerData": function (slideObjectName, type) {

            // TODO: Change this so that 'type' is passed into this function, and the searching for container data is based on type. (Short answer type = "sha")
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
