/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:14 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("BaseSlideObjectDataProxy", function () {
    "use strict";
    function BaseSlideObjectData(name, data, type) {
        this._name = name;
        this._data = data;
        this._type = type;
    }

    BaseSlideObjectData.prototype = {
        get name(){
            return this._name;
        },
        get data() {
            return this._data;
        },
        get type(){
            return this._type;
        },
        get states() {
            if (!this._states) {
                this._states = [];

                _extra.error("BaseSlideObjectData.states has yet to be implemented");
            }

            return this._states;
        }
    };
    _extra.registerClass("BaseSlideObjectDataProxy", BaseSlideObjectData);
});