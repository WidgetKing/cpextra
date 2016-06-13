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
        // TODO: Find slide count
        "slideCount":NaN,
        "internalGotoSlide":function (sceneIndex, slideIndex) {
            _extra.error("internalGotoSlide not defined for Storyline");
        },
        "getCurrentSceneNumber": function() {
            return _extra.storyline.player.currentSlide().sceneIndex;
        },
        "getCurrentSlideNumber": function() {
            return _extra.storyline.player.currentSlide().slideIndex;
        },
        "getCurrentSceneSlideNumber": function() {
            return _extra.storyline.player.currentSlide().sceneSlideIndex;
        }
    };

    var sceneIndex;

    for (var i = 0; i < _extra.storyline.slidesData.length; i += 1) {
        tempData = _extra.storyline.slidesData[i];
        sceneIndex = tempData.sceneIndex;

        if (_extra.slideManager._slideDatas.length <= sceneIndex) {
            // Create a new array for this new scene.
            _extra.slideManager._slideDatas.push([]);
            _extra.slideManager.slideNames.push([]);
        }



        _extra.slideManager._slideDatas[sceneIndex].push(tempData);
        // TODO: Slide names also need to be 'scene' ised.
        _extra.slideManager.slideNames[sceneIndex].push(tempData.title);
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
