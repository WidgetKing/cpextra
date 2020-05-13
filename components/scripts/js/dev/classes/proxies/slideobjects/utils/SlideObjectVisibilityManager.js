/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/3/19
 * Time: 3:18 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideObjectVisibilityManager", function () {

    "use strict";

    function SlideObjectVisibilityManager(slideObject, currentStateData) {

        this._upperContainerVisibility = null;

        this._slideObject = slideObject;
        this.updateStateData(currentStateData);

    }



    SlideObjectVisibilityManager.prototype = {

        get nonContentDivs(){
            return this._upperContainerVisibility;
        },

        set nonContentDivs(value) {
            this._upperContainerVisibility = value;
            this.update();
        },

        "updateStateData": function (newStateData) {
            this._currentStateData = newStateData;
            this.getVisiblityDIVs();
            this.update();
        },

        "getVisiblityDIVs": function () {

            this._visibilityDIVs = [];

            // The DIV which appears on top of the slide object and might block our way to clicking other things
            this._visibilityDIVs.push(this._currentStateData.primaryObject.upperDIV);

            // The DIV which holds the text
            var textHolderName = this._slideObject.name + "_vTxtHolder";
            _extra.utils.addIfDefined(_extra.w.document.getElementById(textHolderName), this._visibilityDIVs);

            var reName = "re-" + this._slideObject.name + "c";
            _extra.utils.addIfDefined(_extra.w.document.getElementById(reName), this._visibilityDIVs);


        },

        "update": function () {

            if (this._upperContainerVisibility === null) {
                return;
            }

            if (this._upperContainerVisibility) {

                this._visibilityDIVs.forEach(function (div) {
                    div.style.pointerEvents = "auto";
                });

            } else {


                this._visibilityDIVs.forEach(function (div) {
                    div.style.pointerEvents = "none";
                });

            }

        }

    };


    _extra.registerClass("SlideObjectVisibilityManager", SlideObjectVisibilityManager);

});