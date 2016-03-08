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
        this._data = data;
    }

    _extra.registerClass("VariableEventProxy", VariableEventProxy, _extra.STORYLINE);

}, _extra.STORYLINE);