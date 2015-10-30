/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 1:54 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ModelListener", function () {

    "use strict";

    function ModelListener(name, model) {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Variables
        ///////////////////////////////////////////////////////////////////////
        ////////////////////////////////
        ////////// Private
        var properties = {};

        ////////////////////////////////
        ////////// Public
        this.model = model;

        ///////////////////////////////////////////////////////////////////////
        /////////////// Public Methods
        ///////////////////////////////////////////////////////////////////////
        this.addProperty = function (propertyName, onChangeCallback, defaultValue) {
            properties[propertyName] = {
                "onChangeCallback":onChangeCallback,
                "defaultValue":defaultValue
            };

            if (model.retrieve(name,propertyName) === undefined) {
                // If this has not been set previously, then we'll write its default value.
                model.write(name,propertyName,defaultValue);
            }

            onChangeCallback(null, model.retrieve(name, propertyName));
        };

        this.unload = function () {
            properties = null;
            model.updateCallback.removeCallback(name, onModelUpdate);
            model = null;
        };




        ///////////////////////////////////////////////////////////////////////
        /////////////// On Model Update
        ///////////////////////////////////////////////////////////////////////
        function onModelUpdate(data) {

            if (properties[data.property]) {

                properties[data.property].onChangeCallback(data.previousValue, data.currentValue);

            }

        }

        model.updateCallback.addCallback(name, onModelUpdate);


    }



    _extra.registerClass("ModelListener", ModelListener);

});