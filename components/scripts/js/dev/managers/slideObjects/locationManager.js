/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/6/17
 * Time: 2:07 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("locationManager", ["slideObjectManager_software"], function () {

    "use strict";

    _extra.slideObjects.locationManager = {

        "isPositionedByPercentage": function (data) {

            var result = _extra.slideObjects.locationManager.getLocation(data, "l");

            if (result) {
                return result.indexOf("%") > -1;
            }

            return false;
        },

        "getLocation": function (data, property) {

            if (data.responsiveCSS) {

                var currentWidthCSS = data.responsiveCSS[_extra.captivate.getResponsiveProjectWidth()];

                if (currentWidthCSS) {
                    // If the value is something like 35%, then we know it's positioned according to percentage.
                    // Otherwise it's positioned according to pixels.
                    return currentWidthCSS[property];
                }
            }

            return false;

        },

        "getOriginalX": function (data) {
            return getOriginalLocation({
                "nativeController":data,
                "boundsProperty":"minX",
                "frameLength": _extra.captivate.getResponsiveProjectWidth,
                "actualFrameLength": _extra.captivate.getProjectWidth,
                "calculateReducedPercentageLocation": _extra.captivate.isResponsive,
                "location": function () {
                    var result = _extra.slideObjects.locationManager.getLocation(data, "l");
                    return _extra.w.parseFloat(result) / 100;
                }
            });
        },

        "getOriginalY": function (data) {
            return getOriginalLocation({
                "actualFrameLength": _extra.captivate.getProjectHeight,
                "nativeController":data,
                "boundsProperty":"minY",
                "calculateReducedPercentageLocation": _extra.captivate.isResponsive,
                "location": function () {
                    var result = _extra.slideObjects.locationManager.getLocation(data, "t");
                    return _extra.w.parseFloat(result) / 100;
                }
            });
        }

    };

    function getOriginalLocation (d) {

        // The following is if it IS responsive
        if (d.calculateReducedPercentageLocation &&
            _extra.slideObjects.locationManager.isPositionedByPercentage(d.nativeController)) {

            //if (d.frameLength() > d.actualFrameLength()) {

            return d.location() * d.actualFrameLength();

        }



        // Non-reponsive
        // OR Responsive with pixel percentage
        return d.nativeController.bounds[d.boundsProperty];

    }

}, _extra.CAPTIVATE);