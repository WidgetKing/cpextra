/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/12/15
 * Time: 2:05 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ButtonStateDataProxy", ["StateDataProxy"], function () {

    "use strict";

    function ButtonStateDataProxy(data) {

        _extra.classes.StateDataProxy.call(this, data, function (data) {

           /* if (_extra.captivate.isResponsive) {

                data.drawMethodObject = data.rawData;
                data.drawMethodName = "drawForResponsive";
                data.timeout = 1;

            } else {

                data.drawMethodObject = data.canvasContext;
                data.drawMethodName = "drawImage";

            }*/

            _extra.slideObjects.states.fixMissingMouseOutIssue(data.rawData, "parentDivName");

            /*///////// Fixes error where the 'mouseout' or 'mouseleave' event won't fire on button shapes.
            _extra.addHookBefore(data.rawData,"HandleMouseEventOnStateItems",function (eventName, internalStateIndex) {

                if (eventName === "mouseout") {

                    // All the mouse event calls are centralized to one of the states inside of the shape button object
                    // Therefore we have to work out whether this event is actually for the RollOver state.

                    var slideObject = _extra.slideObjects.getSlideObjectByName(this.divName);
                    var actualStateData = slideObject.data.getStateDataByInternalIndex(internalStateIndex);

                    // If so, then we'll dispatch a MOUSE_OUT event for xcmndAddEventListener to hear.
                    if (actualStateData.name === "RollOver") {
                        slideObject.dispatchEvent(_extra.eventManager.events.MOUSE_OUT);
                    }
                }
            });*/

        });

    }

    _extra.registerClass("ButtonStateDataProxy", ButtonStateDataProxy, "StateDataProxy", _extra.CAPTIVATE);

}, _extra.CAPTIVATE);