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

            ////////////////////////////////
            ////////// Methods and Variables
            function getSlideNumber(slide) {
                // If it's not a number, it's likely a slide name.
                if (_extra.w.isNaN(slide)) {
                    var index = _extra.slideManager.getSlideIndexFromName(slide);
                    if (index) {
                        // No need to subtract anything, the getSlideIndexFromName method is zero based.
                        return index.slide;
                    } else {
                        _extra.error("CV071", slide);
                        return null;
                    }
                } else {
                    return _extra.w.parseInt(slide) - 1;
                }
            }

            var valueType = typeof value;

            ////////////////////////////////
            ////////// Logic
            if (valueType === "number") {

                if (value <= _extra.slideManager.numSlides) {

                    internalCompleteSlide(value - 1);

                } else {

                    _extra.error("CV072", value, _extra.slideManager.numSlides);

                }

            } else if (valueType === "string") {

                var splitResults = value.split("-"),
                    startIndex,
                    endIndex,
                    tempIndex;

                // If we have been passed ALL
                if (value.toLowerCase() === "all") {
                    // Fake a range to do the loop.
                    splitResults = [1, _extra.slideManager.numSlides];
                }

                switch (splitResults.length) {

                    // Range
                    case 2 :
                            startIndex = getSlideNumber(splitResults[0]);
                            endIndex = getSlideNumber(splitResults[1]);

                            if (startIndex !== null && endIndex !== null) {

                                // Wrote something like: 5 - 3
                                if (startIndex > endIndex) {
                                    tempIndex = startIndex;
                                    startIndex = endIndex;
                                    endIndex = tempIndex; // Changed to: 3 - 5
                                }

                                while (startIndex <= endIndex) {
                                    internalCompleteSlide(startIndex);
                                    startIndex += 1;
                                }

                            }

                        break;

                    case 1:
                            value = getSlideNumber(splitResults[0]);
                            if (value !== null) {
                                internalCompleteSlide(value);
                            }
                        break;

                    default :
                            // Something like: 1-5-8 which is weird. ERROR!
                            _extra.error("CV070", value);
                        break;
                }



            }


        }
    };

}, _extra.CAPTIVATE);