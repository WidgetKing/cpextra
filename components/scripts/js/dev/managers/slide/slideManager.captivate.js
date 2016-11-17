/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";

    var slideIds = _extra.captivate.model.data.project_main.slides.split(","),
        tempBaseData,
        hasDoCPInitHook = false,
        doCPInitCallbacks = [],
        tempContainerData;

    _extra.slideManager = {
        "_slideDatas": [[], []],
        "slideNames": [[], []],
        "numSlides": _extra.captivate.numSlides,
        "currentInternalSlideId":null,
        "currentSlideDOMElement":_extra.w.document.getElementById("div_Slide"),
        "isSlideLoaded":false,
        "internalGotoSlide":function (sceneIndex, slideIndex) {
            _extra.captivate.interface.gotoSlide(slideIndex);
        },
        "getCurrentSlideNumber": function() {
            return _extra.captivate.variables.cpInfoCurrentSlideIndex;
        },
        "getCurrentSceneSlideNumber": function() {
            return _extra.captivate.variables.cpInfoCurrentSlideIndex;
        },
        "getCurrentSceneNumber": function () {
            return 1;
        },
        "hasSlideObjectOnSlide": function (slideObjectName, sceneIndex, slideIndex) {

            slideIndex = _extra.slideManager.parseSlideNumber(sceneIndex, slideIndex);

            if (slideIndex) {

                var details = _extra.captivate.model.data[slideObjectName];

                return details && details.apsn === slideIds[slideIndex.slide];

            }

            return null;

        },
        "software_onSlideEnter":function() {

            this.currentInternalSlideId = slideIds[_extra.slideManager.currentSlideNumber];

        },
        "isInitiated": function () {
            return _extra.captivate.isInitated();
        },
        "registerOnInitiatedCallback": function (method) {

            if (doCPInitCallbacks) {

                if (!hasDoCPInitHook) {
                    _extra.addHookAfter(_extra.w.cp, "DoCPInit", _extra.slideManager.callDoCPInitCallbacks);
                    hasDoCPInitHook = true;
                }

                doCPInitCallbacks.push(method);

            }

        },
        "callDoCPInitCallbacks": function () {

            for (var i = 0; i < doCPInitCallbacks.length; i += 1) {
                doCPInitCallbacks[i]();
            }

            doCPInitCallbacks = null;
            _extra.removeHook(_extra.w.cp, "DoCPInit", _extra.slideManager.callDoCPInitCallbacks);
        },
        "isSlideObjectOnSlideAndNotInTimeline": function (slideObjectName) {

            if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName)) {

                var data = _extra.dataManager.getSlideObjectDataByName(slideObjectName);

                return !_extra.movieStatus.isCurrentFrameWithinRange(data.startFrame, data.endFrame);

            }

            return false;
        }
    };


    ////////////////////////////////
    ////////// slideNames Array Setup

    slideIds.forEach(function(slideID){
        tempBaseData = _extra.captivate.model.data[slideID];
        tempContainerData = _extra.captivate.model.data[slideID + "c"];
        // We're putting the slide data into the second index of the _slideDatas array to 'pretend' that all these slides
        // are inside a single 'scene'. This allows us to use the same code in the GLOBAL section to work with storyline
        // which nests slides inside of scenes.
        // We use the second index because in Storyline the first index is reserved for certain hidden slides, and the
        // 'first' scene where you can place content is saved into the second index.
        _extra.slideManager._slideDatas[1].push({
            "base":tempBaseData,
            "container":tempContainerData
        });
        // Same goes for down here
        _extra.slideManager.slideNames[1].push(tempBaseData.lb);
    });



    ///////////////////////////////////////////////////////////////////////
    /////////////// ON ENTER SLIDE
    ///////////////////////////////////////////////////////////////////////
    _extra.slideManager.addEnterSlideEventListener = function (callback) {
        // For some reason in Chrome when this is called we can't send anything to the console.
        // However, the code is still working.
        _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.SLIDE_ENTER, callback);
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// ON EXIT SLIDE
    ///////////////////////////////////////////////////////////////////////
    _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.SLIDE_EXIT, function () {
        _extra.slideManager.isSlideLoaded = false;
    });


}, _extra.CAPTIVATE);