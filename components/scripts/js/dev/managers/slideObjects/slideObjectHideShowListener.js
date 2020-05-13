/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/03/16
 * Time: 11:47 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectHideShowListener", ["slideObjectManager_global", "hookManager"], function () {

    "use strict";

    /*
     * The point of this module is to listen for when Captivate shows or hides certain slide objects so that we can dispatch
     * Show and Hide events for xcmndAddEventListener
     */

    function listenToHideOrShow (details, event) {

        if (details) {

            // If there are details for this particular function, then we want to do something when that function is called.
            _extra.addHookAfter(details.location, details.name, function (slideObjectName) {

/*
                var slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

                if (event === "show") {

                    slideObject.visibility.nonContentDivs = false;

                } else if (event === "hide") {

                    slideObject.visibility.nonContentDivs = true;

                }
*/

            });

        }

    }

    listenToHideOrShow(_extra.slideObjects._internalShowSlideObjectDetails, "show");
    listenToHideOrShow(_extra.slideObjects._internalHideSlideObjectDetails, "hide");

});