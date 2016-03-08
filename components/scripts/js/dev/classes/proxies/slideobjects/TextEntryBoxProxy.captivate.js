/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/11/15
 * Time: 8:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxProxy", ["BaseSlideObjectProxy"], function () {

    "use strict";

    function TextEntryBoxProxy(element, data) {

        // Call super constructor
        _extra.classes.BaseSlideObjectProxy.call(this, element, data);

        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Variables
        ///////////////////////////////////////////////////////////////////////
        var that = this;
        this._updateToVariable = false;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Initialize
        ///////////////////////////////////////////////////////////////////////
        function initialize() {

            that._inputField = _extra.w.document.getElementById(that.name + "_inputField");

            if (!that._inputField) {
                // It is too early, we need to wait for draw
                return false;
            }

            // Check to see if the value of the text box was set before the input existed.
            if (that.hasOwnProperty("_tempValue")) {
                that.value = that._tempValue;
                delete that._tempValue;
            }


            return true;
        }

        if (!initialize()) {
            this._currentStateData.addOnDrawCallback(initialize);
        }

        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Methods (sorta)
        ///////////////////////////////////////////////////////////////////////
        this._onVariableChangeUpdate = function () {
            var value = _extra.variableManager.getVariableValue(that.data.variable);
            // Only change the value if there's a different one in the field. Otherwise we're going to create an
            // infinite loop.
            if (that.value !== value) {
                that.value = value;
            }
        };

    }

    _extra.registerClass("TextEntryBoxProxy", TextEntryBoxProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    _extra.w.Object.defineProperty(TextEntryBoxProxy.prototype, "value", {
        get: function () {
            if (this._inputField) {
                return this._inputField.value;
            } else {
                return null;
            }
        },
        set: function (value) {
            if (this._inputField) {
                // This if statement prevents potential recursion
                if (this._inputField.value !== value) {
                    this._inputField.value = value;
                    // The above code does not automatically update the linked variable, we have to do that manually.
                    _extra.variableManager.setVariableValue(this.data.variable, value);
                }
            } else {
                this._tempValue = value;
            }
        }
    });

    _extra.w.Object.defineProperty(TextEntryBoxProxy.prototype, "updateToVariable", {
        get: function () {
            return this._updateToVariable;
        },
        set: function (value) {
            this._updateToVariable = value;
            if (value) {
                _extra.variableManager.listenForVariableChange(this.data.variable, this._onVariableChangeUpdate);
            } else {
                _extra.variableManager.stopListeningForVariableChange(this.data.variable, this._onVariableChangeUpdate);
            }
        }
    });

    TextEntryBoxProxy.prototype.unload = function() {

        _extra.variableManager.stopListeningForVariableChange(this.data.variable, this._onVariableChangeUpdate);
        // Super!
        TextEntryBoxProxy.superClass.unload.call(this);
    };

}, _extra.CAPTIVATE);