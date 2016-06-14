/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/03/16
 * Time: 11:59 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for slideObjectHideShowListener", function () {

    "use strict";

    var module = unitTests.getModule("slideObjectHideShowListener"),
        hookModule = unitTests.getModule("hookManager");

    beforeEach(function () {

        this.show = jasmine.createSpy("show");
        this.hide = jasmine.createSpy("hide");

        window._extra = {
            "classes":unitTests.classes,
            "slideObjects":{
                "_internalShowSlideObjectDetails": {
                    "location": this,
                    "name":"show"
                },
                "_internalHideSlideObjectDetails": {
                    "location": this,
                    "name":"hide"
                }
            },
            "w":{
                "Object":Object
            }
        };

        hookModule();

    });

    afterEach(function () {
        delete window._extra;
    });

    it("should add hooks to the internal show and hide methods", function () {

        spyOn(_extra, "addHookAfter");
        module();
        expect(_extra.addHookAfter).toHaveBeenCalledWith(this, "show", jasmine.any(Function));
        expect(_extra.addHookAfter).toHaveBeenCalledWith(this, "hide", jasmine.any(Function));

    });

    it("shouldn't listen to a function if we have not provided any details for it", function () {

        spyOn(_extra, "addHookAfter");
        delete _extra.slideObjects._internalShowSlideObjectDetails;
        module();
        expect(_extra.addHookAfter).toHaveBeenCalledWith(this, "hide", jasmine.any(Function));
        expect(_extra.addHookAfter.calls.count()).toEqual(1);
    });
});