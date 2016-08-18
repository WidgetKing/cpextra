/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 7/12/15
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("createStateDataProxy",["factoryManager"], function () {

    "use strict";

    _extra.factories.createStateDataProxy = function (type, data) {


        switch (type) {

            /*case _extra.dataTypes.slideObjects.CLICK_BOX:
                return new _extra.classes.ClickBoxStateDataProxy(data);

            case _extra.dataTypes.slideObjects.HIGHLIGHT_BOX :
                return new _extra.classes.HighlightBoxStateDataProxy(data);*/

            /*case _extra.dataTypes.slideObjects.CAPTION :
                return new _extra.classes.CaptionStateDataProxy(data);*/

            /*case _extra.dataTypes.slideObjects.WEB_OBJECT :
                return new _extra.classes.WebObjectStateDataProxy(data);*/



                ///////////////////////////////////////////////////////////////////////
                /////////////// IMPLEMENTED
                ///////////////////////////////////////////////////////////////////////
            case _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX :
                return new _extra.classes.TextEntryBoxStateDataProxy(data);

            case _extra.dataTypes.slideObjects.BUTTON :
                return new _extra.classes.ButtonStateDataProxy(data);

            case _extra.dataTypes.slideObjects.VIDEO :
                return new _extra.classes.VideoStateDataProxy(data);

            case _extra.dataTypes.slideObjects.WIDGET :
                return new _extra.classes.WidgetStateDataProxy(data);

            case _extra.dataTypes.slideObjects.SHAPE :
                return new _extra.classes.ShapeStateDataProxy(data);


            default :
                return new _extra.classes.StateDataProxy(data);

        }
    };
});