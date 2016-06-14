/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/15
 * Time: 3:34 PM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    "use strict";

    function testTextEntryBoxData(software, data) {

        describe("A test suite to test TextEntryBoxDataProxy in " + software, function () {
            unitTests.setSoftwareClassAsMain("TextEntryBoxDataProxy", software);

            beforeEach(function () {
                window._extra = {
                    "classes":unitTests.classes,
                    "w":{
                        "Object":Object
                    }
                };
                this.proxy = new unitTests.classes.TextEntryBoxDataProxy("foobar", data);
            });

            afterEach(function () {
                delete window._extra;
            });

            it("should expose the variable linked to the TEB", function () {
                expect(this.proxy.variable).toBe("linkedVariable");
            });
        });

    }

    testTextEntryBoxData(unitTests.CAPTIVATE, {
        "base":{
            "vn":"linkedVariable"
        },
        "container":{
            "txt":"defaultText"
        }
    });
    /*testTextEntryBoxData(unitTests.STORYLINE, {

    });*/


}());