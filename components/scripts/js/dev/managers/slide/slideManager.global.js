/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 5:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_global",["slideManager_software"],function() {

    "use strict";

    ////////////////////////////////
    ///////// ALL FUNCTIONS ARE ZERO BASED
    ////////////////////////////////

    var rawExtra = _extra;

    _extra.slideManager.currentSceneNumber = 1;
    // TODO: Ensure current slide number is the current Scene Slide Number
    _extra.slideManager.currentSlideNumber = 0;
    _extra.slideManager.currentSceneSlideNumber = 0;
    _extra.slideManager.currentSlideID = "0.0";


    /**
     * Zero Based
     * @param sceneIndex
     * @param slideIndex
     * @returns {*}
     */
    _extra.slideManager.parseSlideNumber = function (sceneIndex, slideIndex) {

        if (slideIndex === undefined) {
            slideIndex = sceneIndex;
            sceneIndex = 1;
        }

        if (typeof slideIndex === "string") {

            // Is Slide Name
            if (_extra.w.isNaN(slideIndex)) {

                return _extra.slideManager.getSlideIndexFromName(slideIndex);

            // Is 1.1
            } else {

                var split = slideIndex.split(".");

                switch (split.length) {

                    case 1:
                            slideIndex = _extra.w.parseInt(split[0]);
                        break;

                    case 2 :
                            sceneIndex = _extra.w.parseInt(split[0]);
                            slideIndex = _extra.w.parseInt(split[1]);
                        break;

                    default :
                        return null;


                }

            }


        } else if (slideIndex === undefined) {

            sceneIndex = _extra.slideManager.currentSceneNumber;
            slideIndex = _extra.slideManager.currentSceneSlideNumber;

        }

        if (_extra.slideManager._slideDatas.hasOwnProperty(sceneIndex) &&
            _extra.slideManager._slideDatas[sceneIndex].hasOwnProperty(slideIndex)) {

            return {
                scene:sceneIndex,
                slide:slideIndex
            };

        }

        return null;
    };

    _extra.slideManager.getSlideName = function (sceneIndex, slideIndex) {
        slideIndex = _extra.slideManager.parseSlideNumber(sceneIndex, slideIndex);

        if (slideIndex) {
            return _extra.slideManager.slideNames[slideIndex.scene][slideIndex.slide];
        }

        return null;
    };
    /**
     * Returns an object that formats the data for a particular slide.
     * @param index
     * @returns {*}
     */
    _extra.slideManager.getSlideData = function (sceneIndex, slideIndex) {

        var index = _extra.slideManager.parseSlideNumber(sceneIndex, slideIndex);

        if (index) {
            return new _extra.classes.SlideDataProxy(_extra.slideManager._slideDatas[index.scene][index.slide]);
        }

        return null;
    };


    /**
     * Converts a slide name into a slide index.
     * @param name
     * @returns {*}
     */
    _extra.slideManager.getSlideIndexFromName = function (name) {

        var scene,
            slideNameIndex;

        // Loop through scenes
        for (var i = 0; i < _extra.slideManager.slideNames.length; i += 1) {

            scene = _extra.slideManager.slideNames[i];
            slideNameIndex = scene.indexOf(name);

            if (slideNameIndex > -1) {

                return {
                    "scene":i,
                    "slide":slideNameIndex
                };

            }

        }

        return null;
    };

    _extra.slideManager.gotoSlide = function (sceneIndex, slideIndex) {
        var index = _extra.slideManager.parseSlideNumber(sceneIndex, slideIndex);

        if (index) {
            _extra.slideManager.internalGotoSlide(index.scene, index.slide);
            return true;
        }

        return false;
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

        // In Internet Explorer, _extra will be deleted when we move out of its slide. So we'll add it back to the
        // window object.
        if (!_extra) {
            window._extra = rawExtra;
            //rawExtra.w.X._ = rawExtra;
        }

        var currentScene = _extra.slideManager.getCurrentSceneNumber(),
            currentSlide = _extra.slideManager.getCurrentSlideNumber(),
            currentSlideID = currentScene + "." + currentSlide;

        _extra.slideManager.currentSceneNumber = currentScene;
        _extra.slideManager.currentSlideNumber = currentSlide;
        _extra.slideManager.currentSceneSlideNumber = _extra.slideManager.getCurrentSceneSlideNumber();
        _extra.slideManager.currentSlideID = currentSlideID;

        if (_extra.slideManager.currentSceneSlideNumber !== -1) {
            // Notify all callbacks registered as universal (or "*")
            _extra.slideManager.enterSlideCallback.sendToCallback("*", currentSlideID);

            // Manage any special things that should be done for the software.
            if (_extra.slideManager.hasOwnProperty("software_onSlideEnter")) {
                _extra.slideManager.software_onSlideEnter();
            }

            // If we are on the first scene of the project, then we'll allow callbacks that don't define scene number.
            // Such as: 3
            if (currentScene === 0) {
                _extra.slideManager.enterSlideCallback.sendToCallback(currentSlide, currentSlideID);
            }


            // Notify all callbacks registered to this specific scene and slide index (1.3)
            _extra.slideManager.enterSlideCallback.sendToCallback(currentSlideID, currentSlideID);
        }


    }

    // From now on, when moving into a new slide, we'll call the above function,
    _extra.slideManager.addEnterSlideEventListener(onSlideEnter);

    // Call this onLoad, as that is the first slide.
    return onSlideEnter;



    // TODO: Define: play, pause, gotoPreviousSlide, gotoNextSlide, currentSlideNumber
});