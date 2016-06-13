/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/03/16
 * Time: 1:52 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("VariableEventProxy", function () {

    "use strict";

    function VariableEventProxy(data) {
        // We are extracting the information from an array because the VariableEventManager passes us the arguments
        // it received from the event listener. This allows us to use the same code for Storyline.
        this._data = data[0];
    }

    VariableEventProxy.prototype = {
        get variableName(){
            return this._data.Data.varName;
        },
        get oldValue() {
            return this._data.Data.oldVal;
        },
        get newValue() {
            return this._data.Data.newVal;
        }
    };

    _extra.registerClass("VariableEventProxy", VariableEventProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);