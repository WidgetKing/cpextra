/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("textBoxBehaviour", ["slideObjectManager"], function () {
    "use strict";

    _extra.slideObjectManager.projectTypeCallback.addCallback(_extra.slideObjectManager.types.TEXT_ENTRY_BOX, function () {
        _extra.log("lkjlk");
    });
});