/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/6/17
 * Time: 2:09 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.slideObjects.locationManager", function () {

    "use strict";

    var module = unitTests.getModule("locationManager", unitTests.CAPTIVATE);

    function createData () {
        return {
            "responsiveCSS":{
                "1000":{
                    "l":"50%"
                }
            },
            "bounds":{
                "minX":50,
                "minY":100
            }
        };
    }

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "slideObjects": {

            },
            "captivate": {
                "isResponsive":true,
                getResponsiveProjectWidth: function () {
                    return 1000;
                },
                "getProjectWidth": function() {
                    return 500;
                }
            },
            "w":{
                "parseFloat":parseFloat
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.slideObjects.locationManager", function () {
        expect(_extra.slideObjects.locationManager).toBeDefined();
    });

    it("should detect whether an object is positioned according to percentage", function () {

        var data = createData(),
            result = _extra.slideObjects.locationManager.isPositionedByPercentage(data);

        expect(result).toBe(true);

    });

    it("should be able to extract original location information", function () {

        _extra.captivate.isResponsive = false;

        var data = createData(),
            resultX = _extra.slideObjects.locationManager.getOriginalX(data),
            resultY = _extra.slideObjects.locationManager.getOriginalY(data);

        expect(resultX).toBe(50);
        expect(resultY).toBe(100);

    });

    it("should be able to calculate original location on compressed responsive slide", function () {

        var data = createData(),
            resultX = _extra.slideObjects.locationManager.getOriginalX(data),
            resultY = _extra.slideObjects.locationManager.getOriginalY(data);

        expect(resultX).toBe(250); // half of 500, the width

        // Height is not compressed, so it should remain at is original value
        expect(resultY).toBe(100);

    });
});