/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 6:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("createSlideObjectProxy",["factoryManager"], function () {

    "use strict";

    _extra.factories.createSlideObjectProxy = function (id, element) {
        var data = _extra.dataManager.getSlideObjectDataByName(id);

        switch (data.type) {
            case _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX :
                return new _extra.classes.TextEntryBoxProxy(element, data);

            case _extra.dataTypes.slideObjects.VIDEO :
                return new _extra.classes.VideoProxy(element, data);

            default :
                return new _extra.classes.BaseSlideObjectProxy(element, data);

        }
    };
});