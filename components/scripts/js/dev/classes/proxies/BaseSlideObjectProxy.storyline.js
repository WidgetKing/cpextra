/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 7:07 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("BaseSlideObjectProxy", function () {

    "use strict";

    function BaseSlideObjectProxy(element, data) {
        this.DOMElement = element;
        this._data = data;
    }

    BaseSlideObjectProxy.prototype = {
        get name(){
            return this.DOMElement.id;
        },
        get data() {
            return this._data;
        },
        get type(){
            return this._data.type;
        }
    };

    _extra.registerClass("BaseSlideObjectProxy", BaseSlideObjectProxy, _extra.STORYLINE);

}, _extra.STORYLINE);