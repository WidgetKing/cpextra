/* global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:53 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("Callback", function () {
    "use strict";


    _extra.registerClass("Callback", function () {

        this.data = {};
        this.addCallback = function (index, callback) {
            if (!this.data[index]) {
                this.data[index] = [];
            }
            this.data[index].push(callback);
        };
        this.hasCallbackFor = function (index) {
            return this.data[index] !== undefined;
        };
        this.sendToCallback = function (index,parameter) {
            var returnValue,
                tempReturnValue;

            if (this.data[index]) {

                var a = this.data[index];

                for (var i = 0; i < a.length; i += 1) {

                    // If the callback returns a value, then we'll return it at the end (assuming noting overrides it before then)
                    tempReturnValue = a[i](parameter);

                    if (tempReturnValue !== undefined) {
                        returnValue = tempReturnValue;
                    }

                }
            }

            return returnValue;
        };
        this.forEach = function (method) {

            var a;

            for (var index in this.data) {
                if (this.data.hasOwnProperty(index)) {

                    a = this.data[index];
                    for (var i = 0; i < a.length; i += 1) {
                        method(index,a[i]);
                    }

                }
            }
        };

        this.removeCallback = function (index,callbackToRemove) {
            if (this.data[index]) {
                var a = this.data[index],
                    registeredCallback;
                for (var i = 0; i < a.length; i += 1) {
                    registeredCallback = a[i];
                    if (callbackToRemove === registeredCallback) {
                        a.splice(i,1);

                        // If we have just deleted the last callback for this index, then we'll delete the array so that
                        // hasCallbackFor() will be able to respond accurately.
                        if (a.length <= 0) {
                            delete this.data[index];
                        }
                        break;
                    }

                }
            }
        };
        this.clear = function () {
            this.data = {};
        };

    });
});