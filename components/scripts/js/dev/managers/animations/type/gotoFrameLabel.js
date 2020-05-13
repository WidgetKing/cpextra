/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 9:21 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("gotoFrameLabel", ["effectTypeFactory"], function () {

    "use strict";

    var ENTER = "enter",
        EXIT = "exit";

    _extra.animationManager.effectTypes.registerEffectType({
        "type":101,
        "parameters":[

            // Parameter 1: The number of the frame label
            {
                "type":"number",
                "subtract": 100
            },

            // Parameter 2: Enter or Exit
            {
                "type":"string",
                replace:{
                    "101":ENTER,
                    "102":EXIT
                }
            }
        ],
        "class": function (frameLabel, enterOrExit) {

            var that = this;

            function broadcast () {

                _extra.cpMate.broadcastTo(that.slideObjectName, {
                    "action":"gotoFrameLabel",
                    "parameters":[
                        frameLabel
                    ]
                });

            }


            this.enter = function () {

                if (enterOrExit === ENTER) {

                    broadcast();

                }

            };

            this.exit = function () {

                if (enterOrExit === EXIT) {

                    broadcast();

                }

            };
        }
    });

});