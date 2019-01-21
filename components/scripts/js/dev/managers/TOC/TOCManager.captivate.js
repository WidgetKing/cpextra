/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/02/16
 * Time: 11:49 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TOCManager", ["softwareInterfacesManager","slideManager_software"], function () {

    "use strict";

    var markTOCEntryComplete = _extra.captivate.api.markTOCEntryComplete,
        internalCompleteSlide = function (index) {

            // Complete for LMS
            var slideData = _extra.slideManager.getSlideData(index);

            if (slideData) {
                slideData.complete = true;
            }

            // Complete for TOC
            markTOCEntryComplete(index);

        };

    _extra.TOCManager = {

        // TODO: cp.D[slideid].v = true;
        // TODO: cp.movie.playbackController.GetNumberOfSlidesSeen();

        "completeSlide":function(value) {

            internalCompleteSlide(value - 1);

        }
    };

}, _extra.CAPTIVATE);