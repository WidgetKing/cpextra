/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 10:59 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("StateDataProxy",function () {

    "use strict";

    function StateDataProxy(data) {

        if (data) {

            this._data = data;
            this.slideObjects = [];

            var tempData;

            for (var i = 0; i < data.stsi.length; i += 1) {
                tempData = _extra.captivate.api.getDisplayObjByCP_UID(data.stsi[i]);
                this.slideObjects.push({
                    // Formatted Data for slideObject within state.
                    "upperDIV":tempData.actualParent,
                    "contentDIV":tempData.element.parentNode,
                    //"offsetX":tempData.bounds.minX - x,
                    //"offsetY":tempData.bounds.minY - y,
                    "rawData":tempData
                });
            }

        }
    }

    StateDataProxy.prototype = {
        get name() {
            return this._data.stn;
        }
    };

    StateDataProxy.prototype.addEventListener = function (eventName, callback) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.addEventListener(eventName, callback);
        });
    };

    StateDataProxy.prototype.removeEventListener = function (eventName, callback) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.removeEventListener(eventName, callback);
        });
    };

    StateDataProxy.prototype.setAttribute = function (property, value) {
        this.slideObjects.forEach(function (data) {
            data.upperDIV.setAttribute(property, value);
            data.contentDIV.setAttribute(property, value);
        });

    };

    StateDataProxy.prototype.addClass = function (className, classDetails) {
        var style = _extra.w.document.createElement("style");
        style.type = "text/css";
        style.innerHTML = classDetails;
        _extra.w.document.getElementsByTagName("head")[0].appendChild(style);
        // TODO: This should be handed off to some _extra.cssManager as currently we're adding the disabledForMouse class twice

        className = " " + className;
        this.slideObjects.forEach(function (data) {
            data.upperDIV.className += className;
            data.contentDIV.className += className;
        });
    };

    StateDataProxy.prototype.removeClass = function(className) {

    };

    _extra.registerClass("StateDataProxy", StateDataProxy);

}, _extra.CAPTIVATE);