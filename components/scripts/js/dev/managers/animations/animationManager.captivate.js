/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/26/18
 * Time: 7:17 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("animationManager", ["slideObjectManager_global", "globalSlideObjectTypes"], function () {

    "use strict";

    var effectManagers = [],
        currentSlide;

    function init () {
        createAnimationManagerObject();

        // Listen for new slide
        // Our reason for doing this is so that we can unload an effect managers.
        _extra.slideManager.enterSlideCallback.addCallbackToFront("*", onEnterSlide);
        // Listen for web objects on new slide
        _extra.slideObjects.enteredSlideChildObjectsCallbacks
              .addCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, function (animation) {

                _extra.animationManager.parseAnimation(animation);

            });
    }

    function createAnimationManagerObject () {
        _extra.animationManager = {

            "registerEffectWithTimeKeeper":function (effectManager) {

                _extra.timekeeper.addWatch(effectManager);
                // Add to list of effect managers so that we can remove the watcher
                // when we move to a new slide.
                effectManagers.push(effectManager);

            }

        };
    }



    ///////////////////////////////////////////////////////////////////////
    /////////////// For manager unloading
    ///////////////////////////////////////////////////////////////////////

    function onEnterSlide () {
        if (currentSlide !== _extra.slideManager.currentSlideNumber) {
            unloadManagers();
            currentSlide = _extra.slideManager.currentSlideNumber;
        }
    }

    function unloadManagers () {

        for (var i = 0; i < effectManagers.length; i += 1) {

            _extra.timekeeper.removeWatch(effectManagers[i]);

        }

        effectManagers = [];
    }


    ///////////////////////////////////////////////////////////////////////
    /////////////// Start entry point
    ///////////////////////////////////////////////////////////////////////

    init();

}, _extra.CAPTIVATE);