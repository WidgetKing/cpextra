/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 1:07 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectModelManager", ["slideObjectManager_global", "Model"], function () {

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// THE SLIDE OBJECT MODEL
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    ///////////// The slide object model is used in the following cases.
    ///////////// Say we have a command variable that sets whether a slide object is mouse enabled or not.
    ///////////// If we set 'slide_object_1' to be mouse enabled on the same slide it's on, well that's simple enough.
    ///////////// But, what if it was set on another slide, and needed to be applied when we reach the slide with
    ///////////// 'slide_object_1'?
    ///////////// What's more, what if we do set 'slide_object_1' to be mouse enabled while on its slide, then go
    ///////////// to the next slide, then come back? It must remember that 'slide_object_1' should be mouse enabled.
    ///////////// To do this, we record the slide object's details here in this model. The slide object will always
    ///////////// come here to reference whether it should be mouse enabled or disabled. These methods are never
    ///////////// directly changed on the slide object. The model is changed, and the slide object updates itself.
    ///////////// That way we have consistency. And it's prettier.


    "use strict";

    _extra.slideObjects.model = new _extra.classes.Model();
    // And that's that problem fixed.
    // :-)

    ///////////////////////////////////////////////////////////////////////
    /////////////// SLIDE OBJECT PROXY CREATING
    ///////////////////////////////////////////////////////////////////////

    ////////////////////////////////
    ////////// When slide object is on slide
    // Handling the case where model data is set for an object which doesn't have a proxy created to handle it
    var originalWriteMethod = _extra.slideObjects.model.write;
    // Parasite on to the write function
    _extra.slideObjects.model.write = function(slideObjectName, property, value) {

        // Default behaviour
        originalWriteMethod(slideObjectName, property, value);

        // Check if a slide object needs to be created
        if (_extra.slideManager.hasSlideObjectOnSlide(slideObjectName) && !_extra.slideObjects.doesProxyExistFor(slideObjectName)) {

            _extra.slideObjects.getSlideObjectByName(slideObjectName);

        }
    };

    ////////////////////////////////
    ////////// When moving into a slide with and object that has data in the model
    _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", function (slideObjectName) {

        // Do we have data for this in the model?
        if (_extra.slideObjects.model.hasDataFor(slideObjectName) && !_extra.slideObjects.doesProxyExistFor(slideObjectName)) {

            _extra.slideObjects.getSlideObjectByName(slideObjectName);

        }


    });


    // TODO: Handle situation where we update the model for a slide object that hasn't had a proxy made for it.
    // TODO: Handle moving into a slide and creating proxies for all objects with models.
});