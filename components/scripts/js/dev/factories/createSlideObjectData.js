/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 4:32 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("createSlideObjectData", ["factoryManager", "globalSlideObjectTypes", "TextEntryBoxDataProxy"], function () {
    "use strict";
    _extra.factories.createSlideObjectData = function (name, data, type) {

        switch (type) {

            case _extra.slideObjectsTypes.TEXT_ENTRY_BOX :
                return new _extra.classes.TextEntryBoxDataProxy(name, data);
                break;

        }

    };
});