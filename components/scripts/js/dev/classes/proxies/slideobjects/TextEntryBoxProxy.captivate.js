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
        this._ignoreNextDefaultText = false;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Private Methods (sorta)
        ///////////////////////////////////////////////////////////////////////
        this._onVariableChangeUpdate = function () {
            var value = _extra.variableManager.getVariableValue(that.data.variable);

            if (that._ignoreNextDefaultText) {

                that._ignoreNextDefaultText = false;

                if (value === that.data.defaultText) {
                    return;
                }

            }


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
                    // The above code does not automatically update the linked variable, we initExtra have to do that manually.
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

    TextEntryBoxProxy.prototype.onSlideObjectInitialized = function () {

        this._inputField = this.getInputFieldDiv();

        this._focusDiv = this._inputField;

        // Super!
        TextEntryBoxProxy.superClass.onSlideObjectInitialized.call(this);

        // Check to see if the value of the text box was set before the input existed.
        if (this.hasOwnProperty("_tempValue")) {
            this.value = this._tempValue;
            delete this._tempValue;
        }
    };

    TextEntryBoxProxy.prototype.getInputFieldDiv = function () {
        var field = _extra.w.document.getElementById(this.name + "_inputField");

        // Short answer question field
        if (!field) {
            field = _extra.w.document.getElementById(this.name + "sha_inputField");
        }

        if (!field) {
            _extra.log("Error: Was unable to locate the TEB input field");
        }

        return field;
    };

    TextEntryBoxProxy.prototype.unload = function() {

        _extra.variableManager.stopListeningForVariableChange(this.data.variable, this._onVariableChangeUpdate);
        // Super!
        TextEntryBoxProxy.superClass.unload.call(this);
    };

}, _extra.CAPTIVATE);