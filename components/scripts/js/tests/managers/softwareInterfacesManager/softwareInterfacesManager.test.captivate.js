/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 9:49 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    describe("A test suite to test the Software Interface module for Captivate", function () {

        var module = unitTests.modules["softwareInterfacesManager_" + unitTests.CAPTIVATE];

        beforeEach(function () {
            window._extra = unitTests.getCaptivateMockObject();
            _extra.classes = {
                "PlaybarProxy": function () {}
            };

            this.onLoadCallback = module();
        });

        afterEach(function () {
            delete window._extra;
        });

        it("should define an object to store references to the Captivate API", function () {
            expect(_extra.captivate).toBeDefined();
        });

        it("should locate the basic parts of the 'cp' api", function () {
            expect(_extra.captivate.api).toEqual(_extra.w.cp);
            expect(_extra.captivate.interface).toEqual(_extra.w.cpAPIInterface);
            expect(_extra.captivate.eventDispatcher).toEqual(_extra.w.cpAPIEventEmitter);
        });

        it("should locate the captivate version", function () {
            expect(_extra.captivate.version).toEqual(_extra.w.CaptivateVersion);
        });

        it("should locate captivate variables", function () {
            expect(_extra.captivate.variables.cpInfoCurrentSlide).toBeDefined();
        });

        it("should find the Captivate data model", function () {
            expect(_extra.captivate.model).toEqual(_extra.w.cp.model);
        });

    });

}());