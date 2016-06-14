/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 15/10/15
 * Time: 3:51 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for the public api manager which exposes methods to the _extra.X object.", function () {

    // The publicAPIManager has all its functionality in the onload callback,
    // because by then we can be sure the entire structure of the _extra object has been built.
    // Therefore, we'll use moduleOnLoad rather than call the module constructor.
    var moduleOnLoad = unitTests.getModule("publicAPIManager")();

    beforeEach(function () {
        _extra = {
            "X":{

            },
            slideManager: {
                "getSlideData": "getSlideData",
                "gotoSlide": "gotoSlide"
            },
            "slideObjects":{
                "getSlideObjectByName": "getSlideObjectByName",
                "hide":"hide",
                "show":"show",
                "enable":"enable",
                "disable":"disable",
                "states":{
                    "change":"change"
                }
            },
            "w":{

            }
        };
        moduleOnLoad();
    });

    afterEach(function () {

    });

    it("should expose slide methods", function () {
        expect(_extra.X.getSlideData).toEqual(_extra.slideManager.getSlideData);
        expect(_extra.X.gotoSlide).toEqual(_extra.slideManager.gotoSlide);
        expect(_extra.X.getSlideObjectByName).toEqual(_extra.slideObjects.getSlideObjectByName);

        expect(_extra.X.hide).toEqual(_extra.slideObjects.hide);
        expect(_extra.X.show).toEqual(_extra.slideObjects.show);
        expect(_extra.X.enable).toEqual(_extra.slideObjects.enable);
        expect(_extra.X.disable).toEqual(_extra.slideObjects.disable);
        expect(_extra.X.changeState).toEqual(_extra.slideObjects.states.change);

    });
});