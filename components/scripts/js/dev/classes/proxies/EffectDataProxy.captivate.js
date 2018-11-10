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
        /*
         * Note for start millisecond
         * This is the start millisecond for the SLIDE.
         * For example:
         * startMillisecond = 1000;
         * slideObject.start = 0;
         * AND
         * startMillisecond = 1000
         * slideObject.start = 500;
         *
         * In both the above examples the effect will start ONE SECOND into the slide.
         * That the slide object the effect is attached to starts at a different point
         * does not influence the timing.
         *
         * Other slides in the course will not bump this number.
         */
        get startMillisecond() {

            var listData = this._slideData.animationList[this._listIndex];
            if (listData[1] === this.name) {
                return listData[0];
            } else {
                _extra.error("In effect '" + this.name +"' our animation list index has lost sync with the actual animation. Have we added something to the animation list which has changed this effect's index?");
                return null;
            }

        },
        get startFrame() {
            return millisecondToFrameNumber(this.startMillisecond);
        },


        get endMillisecond() {
            return this.startMillisecond + this.duration;
        },

        get endFrame() {
            return millisecondToFrameNumber(this.endMillisecond);
        },


        get animationProperty() {

            if (!this._animationProperty) {

                // Example:
                // this.name            = "SlideObjectx"
                // this.slideObjectName = "SlideObject"

                this._animationProperty = this.name.substring(this.slideObjectName.length, this.name.length);

                // At this point it's still possible there will be a suffix like: "x_1"
                var underscoreIndex = this._animationProperty.indexOf("_");

                if (underscoreIndex > 0) {
                    this._animationProperty = this._animationProperty.substring(0, underscoreIndex);
                }

            }

            return this._animationProperty;
        },
        get frames() {

            if (!this._frames) {
                this._frames = createFramesObject(this);
            }

            return this._frames;

        }
    };

    function millisecondToFrameNumber (millisecond) {
        return _extra.w.Math.floor(millisecond * _extra.captivate.FPS / 1000);
        // cp.getCpInfoOriginalFPS()
    }

    function createFramesObject (that) {

        var isPercentageMarker = true,
            percentageMarker = 0,
            data = that._data,
            frames = [];

        if (!data.b6) {
            return {};
        }

        for (var i = 0; i < data.b6.length; i += 1) {

            if (isPercentageMarker) {
                percentageMarker = data.b6[i];
            } else {
                frames.push(createIndividualFrameData(percentageMarker, data.b6[i], that));
            }

            isPercentageMarker = !isPercentageMarker;

        }

        return frames;

    }

    function createIndividualFrameData (percent, value, that) {

        percent = percent / 100;

        var millisecond = _extra.w.Math.floor(that.startMillisecond + (that.duration * percent)),
            frame = millisecondToFrameNumber(millisecond);

        return {
            "value":value,
            "percentage":percent,
            "millisecond": millisecond,
            "frame":frame
        };
    }


    _extra.registerClass("EffectDataProxy", EffectDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);