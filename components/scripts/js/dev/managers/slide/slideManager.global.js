/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 5:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_global",["slideManager_software"],function() {

    "use strict";

    /**
     * Returns an object that formats the data for a particular slide.
     * @param index
     * @returns {*}
     */
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


    /**
     * Converts a slide name into a slide index.
     * @param name
     * @returns {*}
     */
    _extra.slideManager.getSlideIndexFromName = function (name) {
        return _extra.slideManager.slideNames.indexOf(name);
    };

    /**
     * Allows you to register with the slideManager to be informed when we enter a new slide.
     * Register '*' to be informed of all slides.
     * Register a number (eg: 3) to be informed when we reach that particular slide.
     * @type {_extra.classes.Callback}
     */
    _extra.slideManager.enterSlideCallback = new _extra.classes.Callback();




    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// ON SLIDE ENTER
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    // This is the start point for a lot of functionality
    function onSlideEnter() {
        var currentScene = _extra.slideManager.getCurrentSceneNumber(),
            currentSlide = _extra.slideManager.getCurrentSlideNumber();

        // Notify all callbacks registered as universal (or "*")
        _extra.slideManager.enterSlideCallback.sendToCallback("*", currentSlide);

        // If we are on the first scene of the project, then we'll allow callbacks that don't define scene number.
        // Such as: 3
        if (currentScene === 0) {
            _extra.slideManager.enterSlideCallback.sendToCallback(currentSlide, currentSlide);
        }

        // Notify all callbacks registered to this specific scene and slide index (1.3)
        _extra.slideManager.enterSlideCallback.sendToCallback(currentScene + "." + currentSlide, currentSlide);


    }

    // From now on, when moving into a new slide, we'll call the above function,
    _extra.slideManager.addEnterSlideEventListener(onSlideEnter);

    // Call this onLoad, as that is the first slide.
    return onSlideEnter;



    // TODO: Define: play, pause, gotoPreviousSlide, gotoNextSlide, currentSlideNumber
});