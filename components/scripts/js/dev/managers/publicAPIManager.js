/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:49 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("publicAPIManager", function () {
    "use strict";

    // We'll wait for everything to be defined before setting up the public API.
    return function () {
        _extra.w.X = _extra.X;

        _extra.X._ = _extra;
        _extra.X.getSlideData = _extra.slideManager.getSlideData;
        _extra.X.gotoSlide = _extra.slideManager.gotoSlide;
        _extra.X.getSlideObjectByName = _extra.slideObjects.getSlideObjectByName;
        /*
        _extra.X.hide = _extra.variableManager.commands.hide;
        _extra.X.show = _extra.variableManager.commands.show;
        _extra.X.disable = _extra.variableManager.commands.disable;
        _extra.X.enable = _extra.variableManager.commands.enable;
        _extra.X.changeState = _extra.variableManager.commands.changeState;
        _extra.X.completeSlide = _extra.variableManager.commands.completeSlide;
        _extra.X.callActionOn = _extra.variableManager.commands.callActionOn;
        */

    };
});