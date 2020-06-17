/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/12/15
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("xprefTEBUpdateToVariable",  ["slideObjectManager_global", "preferenceManager", "eventManager",
                      "globalSlideObjectTypes", "slideManager_global"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE VARIABLES
    ///////////////////////////////////////////////////////////////////////
    var tebOnSlide = {},
        currentSceneNumber,
        currentSlideNumber,
        info = {

        "enable": function () {

            enableTEBs(true);

        },

        "disable": function () {

            enableTEBs(false);

        }

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE METHODS
    ///////////////////////////////////////////////////////////////////////
    function onNewTEB(slideObjectName) {

        // Unload TEBs from previous slides.
        unloadIfNeeded();

        var teb = _extra.slideObjects.getSlideObjectByName(slideObjectName);
        // Enable the TEBs now, if this preference is enabled.
        // If the preference becomes enabled later, then the enableTEBs functions will be executed.
        teb.updateToVariable = info.enabled;
        tebOnSlide[slideObjectName] = teb;

    }

    function unloadIfNeeded() {

        // If we have moved into a new slide / scene.
        if (_extra.slideManager.currentSceneNumber !== currentSceneNumber ||
            _extra.slideManager.currentSlideNumber !== currentSlideNumber) {

            enableTEBs(false);
            tebOnSlide = {};
            currentSceneNumber = _extra.slideManager.currentSceneNumber;
            currentSlideNumber = _extra.slideManager.currentSlideNumber;

        }
    }

    function enableTEBs(value) {
        for (var tebName in tebOnSlide) {
            if (tebOnSlide.hasOwnProperty(tebName)) {

                tebOnSlide[tebName].updateToVariable = value;

            }
        }
    }

    if (_extra.preferenceManager.registerPreferenceModule("TEBUpdateFromVariable", info)) {

        // If we are here, then the variable must be defined.

        // Get a list of TEB proxies.
        _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, onNewTEB);
        // We add this to unload TEB proxies.
        // We do this in both the above callback and the below callback, because it's hard to predict which will come first.
        // Also, on certain slides, the above callback may never be called
        _extra.slideManager.enterSlideCallback.addCallback("*", unloadIfNeeded);

    }

}, _extra.CAPTIVATE);
