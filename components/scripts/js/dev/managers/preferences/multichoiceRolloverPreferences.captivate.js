/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/02/16
 * Time: 3:47 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("multichoiceRolloverPreferences", ["preferenceManager", "hookManager", "slideObjectManager_global"], function () {

    "use strict";

    _extra.preferences.multichoiceRolloverColor = "#000000";
    // Captivate's default setting is 0.3, however if someone just sets the color variable and not the opacity variable
    // they would see it as a bug that the color appears faded. Therefore, we'll use 1 as a default if the color variable is set.
    _extra.preferences.multichoiceRolloverOpacity = 1;

    ///////////////////////////////////////////////////////////////////////
    /////////////// Info for xprefMultichoiceRolloverColor
    ///////////////////////////////////////////////////////////////////////
    var colorInfo = {

        "enable": function() {

        },
        "disable": function() {
            colorInfo.update("#000000");
        },
        "update": function(value) {

            if (typeof value !== "string") {
                value = _extra.w.String(value);
            }

            if (value.charAt(0) !== "#") {
                value = "#" + value;
            }

            _extra.preferences.multichoiceRolloverColor = value;
        }

    },

    ///////////////////////////////////////////////////////////////////////
    /////////////// Info for xprefMultichoiceRolloverOpacity
    ///////////////////////////////////////////////////////////////////////
    opacityInfo = {

        "enable": function() {

        },
        "disable": function() {
            opacityInfo.update(0);
        },
        "update": function(value) {
            // If we haven't been given a number.
            if (typeof value !== "number") {

                if (_extra.w.isNaN(value)) {
                    colorInfo.disable();
                    return;
                }
                value = _extra.w.parseFloat(value);
            }

            // Assign AND convert seconds to milliseconds
            _extra.preferences.multichoiceRolloverOpacity = value / 100;
        }

    };

        // Register xprefMultichoiceRolloverColor
    var hasColorVariable = _extra.preferenceManager.registerPreferenceModule("MultichoiceRolloverColor", colorInfo),
        // Register xprefMultichoiceRolloverOpacity
        hasOpacityVariable = _extra.preferenceManager.registerPreferenceModule("MultichoiceRolloverOpacity", opacityInfo);


    // If any of these variables have been defined, we shall set up.
    if (_extra.captivate.api.MCQInput && hasColorVariable || hasOpacityVariable) {

        ///////////////////////////////////////////////////////////////////////
        /////////////// UNLOADING
        ///////////////////////////////////////////////////////////////////////
        var listenersToUnload = [];
        _extra.slideManager.enterSlideCallback.addCallback("*", function () {

            var data;

            for (var i = listenersToUnload.length - 1; i >= 0; i -= 1) {

                data = listenersToUnload[i];

                data.base.removeEventListener("mouseover",data.handler);

                listenersToUnload.splice(i,1);

            }

        });





        ///////////////////////////////////////////////////////////////////////
        /////////////// MAGIC HERE
        ///////////////////////////////////////////////////////////////////////
        // We'll hook into the class for the rollover object, so we'll be notified whenever one is created.
        _extra.addHookAfter(_extra.captivate.api.MCQInput.prototype,"addHighlightBoxMouseHandlers",function () {

            var that = this,
                dummyHighlight = _extra.w.document.getElementById(this.element.id + "_dummyhighlight"),
                text = _extra.w.document.getElementById(this.answerTextCanvasDivName).parentNode,
                bulletText = this.answerLabelCanvasElement.parentNode;


            // Send the highlight to the top.
            text.style.position = "absolute";
            text.style.zIndex = dummyHighlight.style.zIndex + 1;
            bulletText.style.zIndex = text.style.zIndex + 1;

            function mouseOverHandler () {
                // When the question has been answered, we shouldn't change the rollover color.
                if (!_extra.captivate.api.disableInteractions && that.value !== "disabled") {

                    if (_extra.preferences.multichoiceRolloverColor !== undefined) {
                        dummyHighlight.style.backgroundColor = _extra.preferences.multichoiceRolloverColor;
                    }

                    if (_extra.preferences.multichoiceRolloverOpacity !== undefined) {
                        dummyHighlight.style.opacity = _extra.preferences.multichoiceRolloverOpacity;
                    }

                }
            }

            this.highlightElement.addEventListener("mouseover", mouseOverHandler);

            listenersToUnload.push({
                "base":this.highlightElement,
                "listener":mouseOverHandler
            });
        });

    }






},_extra.CAPTIVATE);