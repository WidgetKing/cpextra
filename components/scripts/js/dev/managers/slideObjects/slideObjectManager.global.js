/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 6:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectManager_global", ["slideObjectManager_software", "queryManager"], function () {
    "use strict";

    /**
     * List of proxy objects associated with slideObjects. This helps us avoid duplication.
     * @type {{}}
     */
    var slideObjectProxies = {};
    /**
     * When entering a slide, the manager will look through all the slide objects on that slide and send the relevant
     * slide object names to this callback.
     * @type {_extra.classes.Callback}
     */
    _extra.slideObjects.enteredSlideChildObjectsCallbacks = new _extra.classes.Callback();
    _extra.slideObjects.getSlideObjectProxy = function (id) {


        var DOMElement;

        // If we were passed in a DOM element rather than the id of a DOM element...
        if (typeof id === "object") {
            DOMElement = id;
            id = DOMElement.id;
        } else {
            // We were given the id of a dom element, so we have to find it.
            DOMElement = _extra.slideObjects.getSlideObjectElement(id);
            //DOMElement = _extra.w.document.getElementById(id);

            // If we could not find the slide object, then... BYE BYE!
            if (!DOMElement) {
                return null;
            }
        }

        // Create new proxy object IF a proxy object hasn't already been created.
        // Otherwise we'll return the previous object.
        if (!slideObjectProxies[id]) {
            // Set this first, because it's possible hasProxyFor will be checked before the proxy has had a chance
            // to be assigned. The line below prevents an infininte loop.
            slideObjectProxies[id] = true;
            slideObjectProxies[id] = _extra.factories.createSlideObjectProxy(id, DOMElement);
        }


        return slideObjectProxies[id];

    };

    _extra.slideObjects.hasProxyFor = function (slideObjectName) {
        return slideObjectProxies.hasOwnProperty(slideObjectName);
    };

    _extra.slideObjects.getSlideObjectByName = function (query) {

        if (_extra.isQuery(query)) {

            // There is a wildcard, so we'll return a list.
            return _extra.slideObjects.getSlideObjectNamesMatchingWildcardName(query, true);

        } else {

            // No wildcard. Grab the object directly of this name.
            return _extra.slideObjects.getSlideObjectProxy(query);

        }

    };

    _extra.slideObjects.unloadSlideObjectsFromOtherSlides = function () {

        var proxy;

        // Run through the list of slide object proxies and unload them
        for (var slideObjectName in slideObjectProxies) {
            if (slideObjectProxies.hasOwnProperty(slideObjectName)) {

                if (!_extra.slideManager.hasSlideObjectOnSlide(
                    slideObjectName,
                    _extra.slideManager.currentSceneNumber,
                    _extra.slideManager.currentSlideNumber)) {

                    proxy = slideObjectProxies[slideObjectName];

                    if (proxy && proxy.unload) {
                        proxy.unload();
                    } else {
                        _extra.log("Slide object proxy '" + slideObjectName +
                                   "' was not loaded correctly.");
                    }

                    delete slideObjectProxies[slideObjectName];

                }

            }
        }
    };

    _extra.slideObjects.getSlideObjectProperty = function (slideObjectName, property) {

        var slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

        if (slideObject) {

            return slideObject[property];

        } else {

            // We have a valid slide object, but it's just not on the slide at the moment.
            // Therefore we'll grab this information from the model.
            return _extra.slideObjects.model.retrieve(slideObjectName, property);

        }

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Command variable methods
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enableForMouse = function (query) {

        //_extra.variableManager.commands.enableForMouse(query);

        /*_extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
         _extra.slideObjects.model.write(slideObjectName, "enableForMouse", true);
         });*/

        _extra.slideObjects.model.write(query, "enableForMouse", true);

    };

    _extra.slideObjects.disableForMouse = function (query) {

        //_extra.variableManager.commands.disableForMouse(query);

        /*_extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
         _extra.slideObjects.model.write(slideObjectName, "enableForMouse", false);
         });*/

        _extra.slideObjects.model.write(query, "enableForMouse", false);

    };


    _extra.slideObjects.setCursor = function (query, cursorType) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "cursor", cursorType);
        });

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// ON SLIDE ENTER
    ///////////////////////////////////////////////////////////////////////
    _extra.slideManager.enterSlideCallback.addCallback("*", function () {

        var slideObjectName;

        _extra.slideObjects.unloadSlideObjectsFromOtherSlides();

        // Clear the proxy list as we are on a new slide with new objects
        //slideObjectProxies = {};

        var slideData = _extra.slideManager.getSlideData();

        if (slideData) {

            for (var i = 0; i < slideData.slideObjects.length; i += 1) {

                slideObjectName = slideData.slideObjects[i];

                _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback("*", slideObjectName);
                _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(
                        _extra.dataManager.getSlideObjectTypeByName(slideObjectName), slideObjectName);

                // Commented out until a time where we will tie this callback into scene/slide numbers
                //_extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.slideManager.currentSlideNumber, slideObjectName);

            }

        } else {
            _extra.error("Could not find slide data in slideObjectManager.global");
        }
    });
});
