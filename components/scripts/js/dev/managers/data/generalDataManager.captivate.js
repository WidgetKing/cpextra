/*global _extra*/
_extra.registerModule("generalDataManager", ["softwareInterfacesManager", "dataTypeConverters", "createSlideObjectData"], function () {

    "use strict";

    _extra.dataManager = {

        "getSlideObjectDataByName": function (slideObjectName) {

            // TODO: Slide object datas are accessed constantly. It may be more efficient to maintain a list of data proxies than createa new one each time.

            var data = {
                "base": _extra.captivate.allSlideObjectsData[slideObjectName]
            };

            if (data.base) {
                data.container = _extra.captivate.allSlideObjectsData[slideObjectName + "c"];
                if (!data.container) {
                    _extra.log("Could not find container data for: " + slideObjectName);
                }
                return _extra.factories.createSlideObjectData(slideObjectName, data,
                                                              _extra.dataTypes.convertSlideObjectType(data.base.type, slideObjectName));
            }
            return null;
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