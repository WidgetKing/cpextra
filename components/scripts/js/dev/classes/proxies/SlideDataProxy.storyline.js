/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideDataProxy", function () {

    "use strict";

    function SlideDataProxy(data) {
        this.name = data.title;
    }

    SlideDataProxy.prototype = {
        get slideObjects(){

            // TODO: Implement this.
            // Only called once to initialize.
            if (!this._slideObjects) {

                this._slideObjects = [];

                // Raw Slide Objects List
                /*var rawSlideObjectList = this._data.base.si;

                for (var i = 0; i < rawSlideObjectList.length; i += 1) {

                    this._slideObjects.push(rawSlideObjectList[i].n);

                }*/

            }
            return this._slideObjects;
        }
    };

    _extra.registerClass("SlideDataProxy", SlideDataProxy, _extra.STORYLINE);

}, _extra.STORYLINE);