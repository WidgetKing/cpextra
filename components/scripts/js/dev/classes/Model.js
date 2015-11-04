/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 2:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("Model", function () {

    "use strict";

    function Model() {

        var m = {},
            callback = new _extra.classes.Callback();

        this.updateCallback = callback;

        function notifyCallback(son,p,pv,v) {

            var callbackData = {
                "slideObjectName":son,
                "property":p,
                "previousValue":pv,
                "currentValue":v
            };


            callback.sendToCallback("*",callbackData);
            callback.sendToCallback(son,callbackData);
        }

        this.write = function (slideObjectName, property, value) {

            var objectData,
                previousValue;

            // If this is the first time we've written to this object...
            if (!m[slideObjectName]) {
                m[slideObjectName] = {};
            }

            objectData = m[slideObjectName];
            previousValue = objectData[property];


            // If the value has changed, then we'll update the model and inform the callbacks.
            if (previousValue !== value) {

                // UPDATE MODEL
                objectData[property] = value;

                notifyCallback(slideObjectName, property, previousValue, value);


            }
        };


        this.retrieve = function (slideObjectName, property) {
            if (property && m[slideObjectName]) {

                return m[slideObjectName][property];

            } else {

                return m[slideObjectName];

            }
        };

        this.hasDataFor = function (slideObjectName) {
            return m.hasOwnProperty(slideObjectName);
        };

        this.update = function (slideObjectName) {
            var objectData = m[slideObjectName],
                value;

            if (objectData) {

                for (var property in objectData) {
                    if (objectData.hasOwnProperty(property)) {

                        value = objectData[property];

                        notifyCallback(slideObjectName,property,value,value);

                    }
                }

            }

        };


    }

    _extra.registerClass("Model", Model);

});