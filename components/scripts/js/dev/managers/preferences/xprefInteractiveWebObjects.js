/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 9:59 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("xprefInteractiveWebObjects", ["slideObjectManager_global", "preferenceManager"], function () {

    "use strict";

    function onNewWebObject (slideObjectName) {

		// If useWidget7 is turned off, then we have no need to enable this.
		if (!_extra.captivate.useWidget7) return;

        var slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

        if (slideObject && !slideObject.data.isSVG) {

            slideObject.interactive = true;

        }

    }

    _extra.preferenceManager.registerPreferenceModule("InteractiveWebObjects", {

        "enable": function () {

            _extra.slideObjects.enteredSlideChildObjectsCallbacks
                               .addCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, onNewWebObject);

        },

        "disable": function () {

            _extra.slideObjects.enteredSlideChildObjectsCallbacks
                               .removeCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, onNewWebObject);

        },

        "default":true

    });

});
