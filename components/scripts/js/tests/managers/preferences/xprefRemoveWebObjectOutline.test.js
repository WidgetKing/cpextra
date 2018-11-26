/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/26/18
 * Time: 10:13 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for preference variable xprefRemoveWebObjectOutline", function () {

    "use strict";

    var module = unitTests.getModule("xprefRemoveWebObjectOutline"),
        xprefRemoveWebObjectOutline,
        slideObjects;

    beforeEach(function () {

        slideObjects = {};

        window._extra = {
            "classes":unitTests.classes,
            "preferenceManager":{
                "registerPreferenceModule": function (name, data) {
                    xprefRemoveWebObjectOutline = data;
                }
            },
            "slideObjects":{
                "getSlideObjectByName": function (n) {
                    return slideObjects[n];
                },
                "enteredSlideChildObjectsCallbacks": new unitTests.classes.Callback()
            },
            "dataTypes":{
                "slideObjects":{
                    "WEB_OBJECT":1
                }
            }
            // _extra.dataTypes.slideObjects.WEB_OBJECT
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should register with preferenceManager", function () {
        expect(xprefRemoveWebObjectOutline).toBeDefined();
    });

    it("should listen for new web objects coming in", function () {

        function hasCallback () {
            return _extra.slideObjects
                   .enteredSlideChildObjectsCallbacks
                   .hasCallbackFor(_extra.dataTypes.slideObjects.WEB_OBJECT);
        }

        xprefRemoveWebObjectOutline.enable();
        expect(hasCallback()).toBe(true);
        xprefRemoveWebObjectOutline.disable();
        expect(hasCallback()).toBe(false);

    });

    it("should hide the border of web slide objects", function () {

        function send (name) {
            _extra.slideObjects
                .enteredSlideChildObjectsCallbacks.sendToCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, name);
        }

        slideObjects.slideObjectName = {
            "border":true
        };

        xprefRemoveWebObjectOutline.enable();

        // ---- Test
        send("slideObjectName");

        expect(slideObjects.slideObjectName.border).toBe(false);

    });
});