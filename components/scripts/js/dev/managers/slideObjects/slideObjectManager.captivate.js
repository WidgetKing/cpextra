/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_software", ["generalDataManager", "Callback", "slideManager_global"], function () {
   "use strict";

    _extra.slideObjects = {
        "allObjectsOfTypeCallback": new _extra.classes.Callback(),
        "getSlideObjectNamesMatchingWildcardName": function (query, returnProxies) {

            var wildcardIndex = query.indexOf(_extra.slideObjects.WILDCARD_CHARACTER);
            if (wildcardIndex > -1) {

                // There is a wildcard character in the query.

                // The following comments are written as if the query passed is is: My_@_Box

                // The part of the query before the wildcard character: My_
                var start = query.substr(0,wildcardIndex),
                // The part of the query after the wildcard character: _Box
                    end = query.substr(wildcardIndex + 1, query.length - 1),

                    slide = _extra.slideManager.currentSlideDOMElement,
                    id,
                    list = [];

                slide.childNodes.forEach(function (child) {
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
                });

                // If we have found no matches, then return nothing.
                if (list.length === 0) {
                    list = null;
                }

                return list;
            }

            // Endpoint if no wildcard was passed in.
            return null;

        }
    };



    ////////////////////
    ///// ON LOAD CALLBACK
    ////////////////////
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
                slideObjectType = _extra.dataTypes.convertSlideObjectType(slideObjectData.type);

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