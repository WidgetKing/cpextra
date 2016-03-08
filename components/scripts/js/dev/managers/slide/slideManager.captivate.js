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
        tempContainerData;

    _extra.slideManager = {
        "_slideDatas": [],
        "slideNames": [],
        "currentInternalSlideId":null,
        "currentSlideDOMElement":_extra.w.document.getElementById("div_Slide"),
        "isSlideLoaded":false,
        "gotoSlide":function (index) {
            if (typeof index === "string") {
                index = _extra.slideManager.getSlideIndexFromName(index);
            }

            _extra.captivate.interface.gotoSlide(index);
        },
        "getCurrentSlideNumber": function() {
            return _extra.captivate.variables.cpInfoCurrentSlideIndex;
        },
        "getCurrentSceneNumber": function () {
            return 0;
        },
        "hasSlideObjectOnSlide": function (slideObjectName, slideIndex) {

            if (!slideIndex) {
                slideIndex = _extra.slideManager.currentSlideNumber;
            }

            var details = _extra.captivate.model.data[slideObjectName];

            return details && details.apsn === slideIds[slideIndex];

        },
        "software_onSlideEnter":function() {

            this.currentInternalSlideId = slideIds[_extra.slideManager.currentSlideNumber];

        }
    };


    ////////////////////////////////
    ////////// slideNames Array Setup

    slideIds.forEach(function(slideID){
        tempBaseData = _extra.captivate.model.data[slideID];
        tempContainerData = _extra.captivate.model.data[slideID + "c"];
        _extra.slideManager._slideDatas.push({
            "base":tempBaseData,
            "container":tempContainerData
        });
        _extra.slideManager.slideNames.push(tempBaseData.lb);
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