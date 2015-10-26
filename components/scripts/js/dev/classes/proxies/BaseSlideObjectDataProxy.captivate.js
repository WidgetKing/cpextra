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

                var rawStatesArray = this._data.base.stl;

                for (var i = 0; i < rawStatesArray.length; i += 1) {

                    this._states.push(rawStatesArray[i].stn);

                }
            }

            return this._states;
        }
    };

    //BaseSlideObjectData.prototype.get

    _extra.registerClass("BaseSlideObjectDataProxy", BaseSlideObjectData);
});