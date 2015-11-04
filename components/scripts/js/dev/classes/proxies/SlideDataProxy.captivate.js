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
        this._data = data;
    }

    SlideDataProxy.prototype = {
        get name(){
            return this._data.base.lb;
        },
        get slideObjects(){

            // Only called once to initialize.
            if (!this._slideObjects) {

                this._slideObjects = [];

                // Raw Slide Objects List
                var rawSlideObjectList = this._data.base.si;

                for (var i = 0; i < rawSlideObjectList.length; i += 1) {

                    this._slideObjects.push(rawSlideObjectList[i].n);

                }

            }
            return this._slideObjects;
        },
        get id() {
            return this._data.container.dn;
        }
    };



    _extra.registerClass("SlideDataProxy", SlideDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);