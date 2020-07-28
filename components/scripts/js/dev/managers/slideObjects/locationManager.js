/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/6/17
 * Time: 2:07 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("locationManager", ["slideObjectManager_software"], function () {

    "use strict";


	function isPercentageValue(value) {
	
		if (value) {
			return value.indexOf("%") > -1;
		}

		return false;
	}

	function getAxisKind(data, axis) {
		var result = _extra.slideObjects.locationManager.getLocation(data, axis);
		if (result === "auto") return "auto";
		return isPercentageValue(result);
	}

    _extra.slideObjects.locationManager = {

        "isPositionedByPercentage": function (data) {

			return getAxisKind(data, "l");
            // var result = _extra.slideObjects.locationManager.getLocation(data, "l");

			// return isPercentageValue(result);
        },

        "getAxisPositionedByPercentage": function (data) {
			return {
				"lvV": getAxisKind(data, "lvV"),
				"l": getAxisKind(data, "l"),
				"t": getAxisKind(data, "t"),
				"lhV": getAxisKind(data, "lhV"),
			}
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
				"minifiedProperty":"l",
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
				"minifiedProperty":"t",
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
        //if (d.calculateReducedPercentageLocation &&
        //    _extra.slideObjects.locationManager.isPositionedByPercentage(d.nativeController)) {

        //    //if (d.frameLength() > d.actualFrameLength()) {

        //    return d.location() * d.actualFrameLength();

        //}

		if (d.calculateReducedPercentageLocation) {
		
			var axisKind = getAxisKind(d.nativeController, d.minifiedProperty);
			
			// We need to use this === true because "auto" is a possible value.
			// if (axisKind === true) {

			// This iwll trigger for 'true' and for 'auto'.
			if (axisKind) {
				return d.location() * d.actualFrameLength();
			}
			
		}


        // Non-reponsive
        // OR Responsive with pixel percentage
        return d.nativeController.bounds[d.boundsProperty];

    }

}, _extra.CAPTIVATE);
