/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 11:15 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectUtilMethods", ["slideObjectManager_global"], function () {

    "use strict";

    function handlePropertyCommand(p1, p2, modelProperty, onlyGetter) {
        // Here are the following possibilities of what's been passed in.
        ////// SET
        // slideObjectName, 100 (number) ---- YES
        // slideObjectName, variable (number) ---- YES
        // slide@Name, 100
        // slide@Name, variable (number)
        // variable, 100
        // variable, variable (number)
        ////// GET
        // variable, slideObjectName ---- YES
        // variable, variable (slideObject)
        var p1Data = _extra.variableManager.parse.string(p1),
            p2Data = _extra.variableManager.parse.string(p2);


        ////////////////////////////////
        ////////// GETTER
        function setVariable(slideObjectName) {


            var valueToSet,
                slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

            if (slideObject) {

                valueToSet = slideObject[modelProperty];

            } else {

                // We have a valid slide object, but it's just not on the slide at the moment.
                // Therefore we'll grab this information from the model.
                valueToSet = _extra.slideObjects.model.retrieve(slideObjectName, modelProperty);

            }

            _extra.variableManager.setVariableValue(p1, valueToSet);
        }

        if (p2Data.isSlideObject && p1Data.isVariable) {

            setVariable(p2);


        } else if (p2Data.isVariable && p2Data.isValueSlideObject && p1Data.isVariable) {

            setVariable(p2Data.variableValue);

        }


        // For some of the properties, like width and height, we may not want to be able to change the value.
        // So we escape here.
        if (onlyGetter) {
            return;
        }



        ////////////////////////////////
        ////////// SETTER
        function setModel(slideObjectName) {
            if (p2Data.isVariable) {
                p2 = p2Data.variableValue;
            }
            _extra.slideObjects.model.write(slideObjectName, modelProperty, p2);
        }


        if (p1Data.isSlideObject) {

            setModel(p1);

        } else if (p1Data.isVariable && p1Data.isValueSlideObject) {

            setModel(p1Data.variableValue);

        } else if (p1Data.isQuery) {

            _extra.slideObjects.enactFunctionOnSlideObjects(p1, function (slideObjectName) {

                setModel(slideObjectName);

            });

        }
    }


    ///////////////////////////////////////////////////////////////////////
    /////////////// Command Variables
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enableForMouse = function (query) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", true);
        });

    };
    _extra.slideObjects.disableForMouse = function (query) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", false);
        });

    };
    _extra.slideObjects.setCursor = function (query, cursorType) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "cursor", cursorType);
        });

    };

    _extra.slideObjects.posX = function (p1, p2) {

        handlePropertyCommand(p1,p2,"x");

    };
    _extra.slideObjects.posY = function (p1, p2) {

        handlePropertyCommand(p1,p2,"y");

    };

    _extra.slideObjects.width = function (p1, p2) {

        handlePropertyCommand(p1,p2,"width", true);

    };
    _extra.slideObjects.height = function (p1, p2) {

        handlePropertyCommand(p1,p2,"height", true);

    };

    _extra.slideObjects.addEventListener = function (query, event, interactiveObject, criteria) {



    };

    _extra.slideObjects.removeEventListener = function (query, event, interactiveObject, criteria) {



    };

});