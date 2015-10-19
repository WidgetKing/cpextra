/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 5:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_global",["slideManager_software"],function() {

    "use strict";

    _extra.slideManager.getSlideData = function (index) {
        if (typeof index === "string") {
            index = _extra.slideManager.getSlideIndexFromName(index);
        }

        if (index === -1) {
            return null;
        } else {
            return new _extra.classes.SlideDataProxy(_extra.slideManager._slideDatas[index]);
        }
    };

    _extra.slideManager.getSlideIndexFromName = function (name) {
        return _extra.slideManager.slideNames.indexOf(name);
    };

    // TODO: Define: play, pause, gotoPreviousSlide, gotoNextSlide, currentSlideNumber
});