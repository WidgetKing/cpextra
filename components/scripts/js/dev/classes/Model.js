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

        var m = {};

        this.updateCallback = new _extra.classes.Callback();

        this.write = function (slideObjectName, property, value) {

            var objectData,
                previousValue,
                callbackData;

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

                callbackData = {
                    "slideObjectName":slideObjectName,
                    "property":property,
                    "previousValue":previousValue,
                    "currentValue":value
                };


                this.updateCallback.sendToCallback("*",callbackData);
                this.updateCallback.sendToCallback(slideObjectName,callbackData);
            }
        };


        this.retrieve = function (slideObjectName, property) {
            if (property && m[slideObjectName]) {

                return m[slideObjectName][property];

            } else {

                return m[slideObjectName];

            }
        };


    }

    _extra.registerClass("Model", Model);

});