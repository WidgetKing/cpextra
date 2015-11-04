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

        // When registering this class it will be instantiated without any parameters which causes an error in
        // some of the following code.
        if (data) {

            this._name = name;
            this._data = data;
            this._type = type;

            this._key = this._data.base.mdi;
            this._initialStateData = _extra.captivate.api.getDisplayObjByKey(this._key);

        }
    }

    BaseSlideObjectData.prototype = {
        get name(){
            return this._name;
        },
        get data() {
            return this._data;
        },
        get type() {
            return this._type;
        },
        get uid() {
            return this._data.container.uid;
        },
        get states() {

            if (!this._states) {
                this._states = [];

                var rawStatesArray = this._data.base.stl;

                // Objects such as widgets do not have the stl property. So we check this is valid before continuing.
                if (rawStatesArray) {

                    for (var i = 0; i < rawStatesArray.length; i += 1) {

                        this._states.push(rawStatesArray[i].stn);

                    }

                }
            }

            return this._states;
        },
        get currentStateName() {
            if (this.states.length <= 0) {
                return "Normal";
            } else {
                return this.states[this._initialStateData.currentState];
            }
        },
        get isInteractiveObject() {
            return this._data.base.hasOwnProperty("oca");
        },
        get successAction() {
            return this._data.base.oca;
        },
        get failureAction() {
            return this._data.base.ofa;
        }
    };

    BaseSlideObjectData.prototype.getDataForState = function (stateName) {
        // If this is the first time we've called this method for this instance.
        if (!this._stateDatas) {

            // Define variables
            var stateDataProxy,
                stateDatas = {};
            // Set public variable so we can keep track of whether this is the first time or not.
            this._stateDatas = stateDatas;

            if (this._initialStateData.states.length <= 1) {

                // This object does not have any states.
                // So we have to fake the data.
                stateDatas[stateName] = new _extra.classes.StateDataProxy({
                    "stsi":[this.uid],
                    "stn":"Normal"
                });

            } else {

                // Loop through the state information
                this._initialStateData.states.forEach(function (rawStateData) {
                    stateDataProxy = new _extra.classes.StateDataProxy(rawStateData);
                    // Assign this data to the holder object.
                    stateDatas[stateDataProxy.name] = stateDataProxy;
                });

            }
        }

        return this._stateDatas[stateName];
    };

    _extra.registerClass("BaseSlideObjectDataProxy", BaseSlideObjectData);
});