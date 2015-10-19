/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("createSlideObjectData", ["factoryManager"], function () {
    "use strict";

    // We have not added requirements for each of the proxy classes as in theory this function would not be called until
    // onload time. However, if we do run into the case where we need to call this before then... Well... Bummer.

    _extra.factories.createSlideObjectData = function (name, data, type) {



        switch (type) {

            case _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX :
                return new _extra.classes.TextEntryBoxDataProxy(name, data, type);

            default :
                return new _extra.classes.BaseSlideObjectDataProxy(name, data, type);

        }

    };
});