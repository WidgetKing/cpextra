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
            if (data.responsiveCSS) {

                var currentWidthCSS = data.responsiveCSS[_extra.captivate.getResponsiveProjectWidth()];

                if (currentWidthCSS) {
                    // If the value is something like 35%, then we know it's positioned according to percentage.
                    // Otherwise it's positioned according to pixels.
                    return currentWidthCSS.l.indexOf("%") > -1;
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
                "calculateReducedPercentageLocation": _extra.captivate.isResponsive
            });
        },

        "getOriginalY": function (data) {
            return getOriginalLocation({
                "nativeController":data,
                "boundsProperty":"minY",
                "calculateReducedPercentageLocation": false
            });
        }

    };

    function getOriginalLocation (d) {

        var value = d.nativeController.bounds[d.boundsProperty];

        if (d.calculateReducedPercentageLocation &&
            _extra.slideObjects.locationManager.isPositionedByPercentage(d.nativeController) &&
            d.frameLength() > d.actualFrameLength()) {

            return value * (d.actualFrameLength() / d.frameLength());

        }

        return value;

    }

}, _extra.CAPTIVATE);