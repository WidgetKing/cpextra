/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 9:50 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";

    describe("A test suite to test the Software Interface module for Storyline", function () {

        var module = unitTests.modules["softwareInterfacesManager_" + unitTests.STORYLINE];

        beforeEach(function () {
            window._extra =  unitTests.getStorylineMockObject();

            this.onLoadCallback = module();
        });

        afterEach(function () {
            delete window._extra;
        });

        it("should define an object to hold references to the storyline api", function () {
            expect(_extra.storyline).toBeDefined();
        });

        it("should locate major parts of the storyline api", function () {
            expect(_extra.storyline.api).toEqual(_extra.w.story);
            expect(_extra.storyline.variables).toEqual(_extra.w.story.variables);
            expect(_extra.storyline.player).toEqual(_extra.w.player);
            expect(_extra.storyline.slidesData).toEqual(_extra.w.story.allSlides);
        });

    });
}());