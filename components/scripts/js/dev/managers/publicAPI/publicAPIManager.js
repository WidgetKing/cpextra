/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:49 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("publicAPIManager", function () {
    "use strict";

    // We'll wait for everything to be defined before setting up the public API.
    return function () {
        _extra.w.X = _extra.X;

        _extra.X.getSlideData = _extra.slideManager.getSlideData;
        _extra.X.gotoSlide = _extra.slideManager.gotoSlide;
    };
});