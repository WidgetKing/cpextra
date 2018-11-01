/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/26/18
 * Time: 9:56 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("EffectDataProxy", [], function () {

    "use strict";

    function EffectDataProxy(data, name, listIndex, slideData) {
        this._slideData = slideData; // So that you can access the parent and add new animations
        this._listIndex = listIndex;
        this._name = name; // parent[name] will access the same object as this._data
        this._data = data;
    }

    EffectDataProxy.prototype = {
        get name() {
            return this._name;
        },
        get slideObjectName(){
            return this._data.a3;
        },
        get duration() { // In miliseconds
            return this._data.a6;
        },
        get start() {
            var listData = this._slideData.animationList[this._listIndex];
            if (listData[1] === this.name) {
                return listData[0];
            } else {
                _extra.error("In effect '" + this.name +"' our animation list index has lost sync with the actual animation. Have we added something to the animation list which has changed this effect's index?");
                return null;
            }
        }
    };


    _extra.registerClass("EffectDataProxy", EffectDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);