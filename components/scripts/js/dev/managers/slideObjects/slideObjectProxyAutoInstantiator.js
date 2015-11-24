/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 9:27 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectProxyAutoInstantiator", ["slideObjectManager_global"], function () {

    "use strict";

    /*
    // Check if a slide object needs to be created
                if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName) &&
                   !_extra.slideObjects.doesProxyExistFor(slideObjectName)) {

                    _extra.slideObjects.getSlideObjectByName(slideObjectName);

                }
     */
    var lookupFunctions = [];

    _extra.slideObjects.proxyAutoInstantiator = {
        "check":function (slideObjectName) {

            if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName) &&
               !_extra.slideObjects.hasProxyFor(slideObjectName)) {

                _extra.slideObjects.getSlideObjectProxy(slideObjectName);

            }

            return _extra.slideObjects.hasSlideObjectInProject(slideObjectName);

        },
        "registerModelLookup":function (callback) {

            lookupFunctions.push(callback);

        },
        "hasModelDataFor":function (slideObjectName) {

            for (var i = 0; i < lookupFunctions.length; i += 1) {

                // If the lookup function returns true, it means data exists for that item.
                if (lookupFunctions[i](slideObjectName)) {
                    return true;
                }

            }

            // If we get to here without finding relevant data, none exists.
            return false;

        }
    };

    ////////////////////////////////
    ////////// When moving into a slide with and object that has data in the model
    _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", function (slideObjectName) {

        // Do we have data for this in the model?
        if (_extra.slideObjects.proxyAutoInstantiator.hasModelDataFor(slideObjectName) &&
           !_extra.slideObjects.hasProxyFor(slideObjectName)) {

            _extra.slideObjects.getSlideObjectProxy(slideObjectName);

        }


    });

});