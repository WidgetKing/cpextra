/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 2:04 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideManager_software", ["softwareInterfacesManager","Callback"], function () {

    "use strict";

    var tempData;

    _extra.slideManager = {
        "_slideDatas":[],
        "slideNames":[],
        "gotoSlide":function (index) {
            if (typeof index === "string") {
                index = _extra.slideManager.getSlideIndexFromName(index);
            }

            _extra.error("Not defined for Storyline");
        },
        "getCurrentSceneNumber": function() {
            return _extra.storyline.player.currentSlide().sceneIndex;
        },
        "getCurrentSlideNumber": function() {
            return _extra.storyline.player.currentSlide().sceneSlideIndex;
        }
    };

    //_extra.log(_extra.storyline.player.currentSlide());

    for (var i = 0; i < _extra.storyline.slidesData.length; i += 1) {
        tempData = _extra.storyline.slidesData[i];
        _extra.slideManager._slideDatas.push(tempData);
        _extra.slideManager.slideNames.push(tempData.title);
    }


    _extra.slideManager.addEnterSlideEventListener = function (callback) {
        // onnextslide
        // onbeforeslidejump
        // onbeforeslidein
        // ontransitionincomplete
        // onslidestart
        //_extra.error("_extra.slideManager.addEnterSlideEventListener has not been implemented");
        // LOOK IN TO: registerVariableEventSubscriber

        // What's holding this up is finding out how you're supposed to add listeners to these events
    };




}, _extra.STORYLINE);
