/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";

    var slideIDs = _extra.captivate.model.data.project_main.slides.split(","),
        tempBaseData,
        tempContainerData;

    _extra.slideManager = {
        "_slideDatas": [],
        "slideNames": [],
        "currentSlideDOMElement":_extra.w.document.getElementById("div_Slide"),
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
        }
    };


    ////////////////////////////////
    ////////// slideNames Array Setup

    slideIDs.forEach(function(slideID){
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
        _extra.captivate.eventDispatcher.addEventListener(_extra.captivate.events.SLIDE_ENTER, callback);
    };


}, _extra.CAPTIVATE);