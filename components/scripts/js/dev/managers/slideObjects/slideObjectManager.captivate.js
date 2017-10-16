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
        "getSlideObjectByDIV":function (div) {

            var name = div.id,
                TEB_SUFFIX = "_inputField",
                returnValue = null;

            // Remove the TEB_SUFFIX from the end of the div name.
            if (name.substr(name.length - TEB_SUFFIX.length, name.length) === TEB_SUFFIX) {
                name = name.substr(0, name.length - TEB_SUFFIX.length);
            }

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

            var queryType = _extra.getQueryType(query);

            if (queryType) {

                var list = [],
                    i;

                // Local slide
                if (queryType === _extra.WILDCARD_CHARACTER) {

                    var slide = _extra.slideManager.currentSlideDOMElement;

                    for (i = 0; i < slide.childNodes.length; i += 1) {
                        list.push(slide.childNodes[i].id);
                    }

                // Whole project
                } else if (queryType === _extra.GLOBAL_WILDCARD_CHARACTER) {

                    list = _extra.slideObjects.projectSlideObjectNames;

                // Unknown
                } else {
                    return null;
                }


                /// Found the list, make the query.
                list = _extra.queryList(query, list, queryType);

                // If a list of proxies was wanted, not a list of names
                if (list && returnProxies) {

                    var proxyList = [];

                    for (i = 0; i < list.length; i += 1) {

                        proxyList.push(_extra.slideObjects.getSlideObjectProxy(list[i]));

                    }

                    list = proxyList;

                }

                return list;

            }

            return null;

            // Previously, before we externalized this code to _extra.queryList
            /*var wildcardIndex = query.indexOf(_extra.slideObjects.WILDCARD_CHARACTER);
            if (wildcardIndex > -1) {

                // There is a wildcard character in the query.

                // The following comments are written as if the query passed is is: My_@_Box

                // The part of the query before the wildcard character: My_
                var start = query.substr(0,wildcardIndex),
                // The part of the query after the wildcard character: _Box
                    end = query.substr(wildcardIndex + 1, query.length - 1),

                    slide = _extra.slideManager.currentSlideDOMElement,
                    id,
                    list = [],
                    child;

                for (var i = 0; i < slide.childNodes.length; i += 1) {
                    child = slide.childNodes[i];
                    id = child.id;

                    // Check if this slide objects's name matches the first part of the passed in query.
                    if (id.substr(0,start.length) === start) {

                        // Now check if it matches the last part.
                        if (id.substr(id.length - end.length, id.length - 1) === end) {

                            // The query matches, so we'll add this child to the list of display objects we'll return.
                            if (returnProxies) {

                                list.push(_extra.slideObjects.getSlideObjectProxy(id));

                            } else {

                                list.push(id);

                            }

                        }

                    }
                }

                // If we have found no matches, then return nothing.
                if (list.length === 0) {
                    list = null;
                }

                return list;
            }

            // Endpoint if no wildcard was passed in.
            return null;*/

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

    /*_extra.slideObjectManager = {
        "types": {
            "CLOSE_PATH":4,
            "CLICK_BOX":13,
            "HIGHLIGHT_BOX":14,
            "CAPTION":19,
            "TEXT_ENTRY_BOX":24,
            "TEXT_ENTRY_BOX_SUBMIT_BUTTON":75,
            "BUTTON":177
        },
        "projectTypeCallback":new _extra.classes.Callback()
    };

    return function () {
        var pd = _extra.dataManager.projectSlideObjectData,
            c = _extra.slideObjectManager.projectTypeCallback,
            slideObjectName,
            slideObjectData;

        for (slideObjectName in pd) {

            if (pd.hasOwnProperty(slideObjectName)) {

                //_extra.log(pd);
                slideObjectData = pd[slideObjectName];

                c.sendToCallback(slideObjectData.type, slideObjectData);

            }
        }
    };*/
},_extra.CAPTIVATE);