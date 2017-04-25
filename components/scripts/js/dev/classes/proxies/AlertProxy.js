/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/04/17
 * Time: 2:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("AlertProxy", [], function () {

    "use strict";

    function AlertProxy (data) {
        this._data = data;
    }

    AlertProxy.prototype.getFirstButtonAction = function () {
        return this._data.m_firstButtonHandler;
    };

    AlertProxy.prototype.setFirstButtonAction = function (action) {
        this._data.registerFirstButtonHandler(action);
    };

    AlertProxy.prototype.show = function () {
        this._data.show();
    };

    _extra.registerClass("AlertProxy", AlertProxy);

}, _extra.CAPTIVATE);