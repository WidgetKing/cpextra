/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_software", ["generalDataManager", "Callback", "slideManager_global", "queryManager"], function () {
   "use strict";


    _extra.slideObjects = {
        "allObjectsOfTypeCallback": new _extra.classes.Callback(),
        "_internalShowSlideObjectDetails": {
            "location": _extra.captivate.api,
            "name":"show"
        },
        "_internalHideSlideObjectDetails": {
            "location": _extra.captivate.api,
            "name":"hide"
        },
        /**
         * This function takes a query, converts it into a list of slide objects, then applies a function to those slide objects.
         *
         * Useful for enhancing Captivate's own internal show, hide, and enable, disable functions.
         */
        "enactFunctionOnSlideObjects": function (query, method) {
            if (_extra.isQuery(query)) {

                var list = _extra.slideObjects.getSlideObjectNamesMatchingWildcardName(query, false);

                if (list) {

                    for (var i = 0; i < list.length; i += 1) {

                        method(list[i]);

                    }

                }

            } else {

                method(query);

            }
        },
        "hasSlideObjectInProject":function (slideObjectName) {
            return _extra.captivate.allSlideObjectsData.hasOwnProperty(slideObjectName);
        },
        "getSlideObjectElement": function(id) {
            return _extra.w.document.getElementById(id);
        },
        "hide":function (slideObjectName) {
            _extra.captivate.api.hide(slideObjectName);
        },
        "show":function (slideObjectName) {
            _extra.captivate.api.show(slideObjectName);
        },
        "hideNonContentDivs":function (slideObjectName) {
            _extra.slideObjects.getSlideObjectByName(slideObjectName).visibility.nonContentDivs = false;
        },
        "showNonContentDivs":function (slideObjectName) {
            _extra.slideObjects.getSlideObjectByName(slideObjectName).visibility.nonContentDivs = true;
        },
        "enable":function (slideObjectName) {
            _extra.captivate.api.enable(slideObjectName);
        },
        "disable":function (slideObjectName) {
            _extra.captivate.api.disable(slideObjectName);
        },
        "getSlideObjectNameFromStateName": function (stateName) {
            var data = _extra.dataManager.getSlideObjectDataByName(stateName);
            if (data && !data.isBaseStateItem) {
                data = data.getBaseStateItemData();
                if (data) {
                    stateName = data.name;
                }
            }
            return stateName;
        },
        "removeSuffix":function (name, suffix) {

            if (name.substr(name.length - suffix.length, name.length) === suffix) {
                name= name.substr(0, name.length - suffix.length);
            }

            return name;
        },
        "getSlideObjectByDIV":function (div) {

            if (!div) {
                return null;
            }

            var name = div.id,
                returnValue = null;

            // Remove the TEB_SUFFIX from the end of the div name.
            name = _extra.slideObjects.removeSuffix(name, "_inputField");
            name = _extra.slideObjects.removeSuffix(name, "sha");


            if (_extra.slideObjects.hasSlideObjectInProject(name) &&
                !_extra.dataManager.isHyperlink(name) &&
                !_extra.slideManager.isNameOfSlide(name)) {

                // Just in case we clicked on the state of an object.
                name = _extra.slideObjects.getSlideObjectNameFromStateName(name);

                returnValue = _extra.slideObjects.getSlideObjectByName(name);

            }

            return returnValue;

        },
        "getSlideObjectNamesMatchingWildcardName": function (query, returnProxies) {

            function entryPoint () {
                /// ENTRY POINT
                var queryType = _extra.getQueryType(query),
                    list;

                if (!queryType) {
                    return null;
                }

                list = createList(queryType);

                if (list) {

                    /// Found the list, make the query.
                    list = _extra.queryList(query, list, queryType);

                    list = convertToProxies(list);

                }

                return list;
            }

            function createList (type) {

                switch (type) {

                    case _extra.GLOBAL_WILDCARD_CHARACTER:
                        return _extra.slideObjects.projectSlideObjectNames;

                    case _extra.WILDCARD_CHARACTER :

                        var slide = _extra.slideManager.currentSlideDOMElement,
                            list = [];

                        for (var i = 0; i < slide.childNodes.length; i += 1) {
                            list.push(slide.childNodes[i].id);
                        }

                        return list;

                }

                return null;

            }

            function convertToProxies (list) {

                // If a list of proxies was wanted, not a list of names
                if (!list || !returnProxies) {
                    return list;
                }

                var proxyList = [];

                for (var i = 0; i < list.length; i += 1) {

                    proxyList.push(_extra.slideObjects.getSlideObjectProxy(list[i]));

                }

                return proxyList;

            }

            return entryPoint();

        },
        "getNativeSlideObjectByName": function (name) {
            return _extra.captivate.api.getDisplayObjByKey(name);
        },
        "isInteractiveObject": function (slideObjectName) {
            var data = _extra.dataManager.getSlideObjectDataByName(slideObjectName);
            if (data) {
                return data.isInteractiveObject;
            }
            return false;
        },
        "projectSlideObjectNames":{}
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// ON LOAD CALLBACK
    ///////////////////////////////////////////////////////////////////////

    return function () {

        // Go through the data for all objects in the project in order to find all of a certain type.
        // Then send their names to the allObjectsOfTypeCallback.
        // Directly this functionality is for the TextEntryBox Behaviour module.
        var projectData = _extra.captivate.allSlideObjectsData,
            slideObjectData,
            slideObjectType;

        for (var slideObjectName in projectData) {
            if (projectData.hasOwnProperty(slideObjectName)) {

                slideObjectData = projectData[slideObjectName];
                slideObjectType = _extra.dataTypes.convertSlideObjectType(slideObjectData.type, slideObjectName);

                _extra.slideObjects.allObjectsOfTypeCallback.sendToCallback(slideObjectType, slideObjectName);

            }
        }

    };

},_extra.CAPTIVATE);