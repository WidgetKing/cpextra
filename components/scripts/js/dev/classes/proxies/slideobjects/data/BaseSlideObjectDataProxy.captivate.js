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
        get originalX() {
            return this._data.container.vbwr[0];
        },
        get originalY() {
            return this._data.container.vbwr[1];
        },
        get originalWidth() {
            return this._data.container.vbwr[2];
        },
        get originalHeight() {
            return this._data.container.vbwr[3];
        },
        get startFrame() {
            return this._data.base.from;
        },
        get endFrame() {
            return this._data.base.to;
        },
        get type() {
            return this._type;
        },
        get uid() {
            return this._data.container.uid;
        },
        get isBaseStateItem() {
            return this._data.base.bstiid === -1;
        },
        get baseStateItemID() {
            return this._data.base.bstiid;
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
        },
        get hasAudio() {
            return this._data.base.ia !== undefined;
        },
        get audioID() {
            return this._data.base.ia;
        },
        get stateDatas () {

            // If this is the first time we've called this method for this instance.
            if (!this._stateDatas) {

                var that = this;
                // Define variables
                var stateDataProxy,
                    stateDatas = {};
                // Set public variable so we can keep track of whether this is the first time or not.
                this._stateDatas = stateDatas;

                if (this._initialStateData.states.length <= 1) {

                    // This object does not have any states.
                    // So we have to fake the data.
                    // Previous version of this line when it was in the getStateData section
                    // stateDatas[stateName] = _extra.factories.createStateDataProxy(this.type, {
                    stateDatas.Normal = _extra.factories.createStateDataProxy(this.type, {
                        "stsi":[this.uid],
                        "stn":"Normal",
                        "stt":0
                    });
                    /*stateDatas[stateName] = new _extra.classes.StateDataProxy({
                        "stsi":[this.uid],
                        "stn":"Normal"
                    });*/

                } else {

                    // Loop through the state information
                    this._initialStateData.states.forEach(function (rawStateData) {

                        stateDataProxy = _extra.factories.createStateDataProxy(that.type, rawStateData);
                        // stateDataProxy = new _extra.classes.StateDataProxy(rawStateData);
                        // Assign this data to the holder object.
                        stateDatas[stateDataProxy.name] = stateDataProxy;

                    });

                }
            }

            return this._stateDatas;
        }
    };

    BaseSlideObjectData.prototype.hasState = function (stateName) {
        return this.states.indexOf(stateName) > -1;
    };

    BaseSlideObjectData.prototype.getBaseStateItemData = function () {

        if (!this.isBaseStateItem) {

            return _extra.dataManager.getSlideObjectDataByID(this.baseStateItemID);

        }

        return null;
    };


    BaseSlideObjectData.prototype.getStateDataByInternalIndex = function (index) {

        var data;

        for (var stateName in this.stateDatas) {
            if (this.stateDatas.hasOwnProperty(stateName)) {

                data = this.stateDatas[stateName];

                if (data.internalIndex === index) {
                    return data;
                }

            }
        }

        return null;
    };

    BaseSlideObjectData.prototype.getDataForState = function (stateName) {
        return this.stateDatas[stateName];
    };

    _extra.registerClass("BaseSlideObjectDataProxy", BaseSlideObjectData);
});