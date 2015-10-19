/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager"], function () {

    "use strict";

    var slideIDs = _extra.captivate.model.data.project_main.slides.split(","),
        tempBaseData,
        tempContainerData;

    _extra.slideManager = {
        "_slideDatas": [],
        "slideNames": [],
        "gotoSlide":function (index) {
            if (typeof index === "string") {
                index = _extra.slideManager.getSlideIndexFromName(index);
            }

            _extra.captivate.interface.gotoSlide(index);
        },
        "currentSlideDOMElement":_extra.w.document.getElementById("div_Slide")
    };

    slideIDs.forEach(function(slideID){
        tempBaseData = _extra.captivate.model.data[slideID];
        tempContainerData = _extra.captivate.model.data[slideID + "c"];
        _extra.slideManager._slideDatas.push({
            "base":tempBaseData,
            "container":tempContainerData
        });
        _extra.slideManager.slideNames.push(tempBaseData.lb);
    });



}, _extra.CAPTIVATE);