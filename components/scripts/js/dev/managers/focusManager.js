/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/16
 * Time: 10:36 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("focusManager", [], function () {

    "use strict";

    _extra.focusManager = {

        "getSlideObjectFocusDivName": function (slideObjectName) {

            var data = _extra.dataManager.getSlideObjectDataByName(slideObjectName);

            switch (data.type) {

                case _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX :
                    return data.inputDivName;

            }

            return slideObjectName;
        },

        "unlockFocusFrom": function (slideObjectName) {

            //_extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {

                _extra.slideObjects.model.write(slideObjectName, "lockFocus", false);

            //});

        },

        "lockFocusTo": function (slideObjectName) {

            //_extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {

                _extra.slideObjects.model.write(slideObjectName, "lockFocus", true);

            //});



            /*_extra.w.setTimeout(function () {

            var divName = _extra.focusManager.getSlideObjectFocusDivName(slideObjectName);

            if (divName) {

                divName = "#" + divName;

                _extra.$(divName).on('keydown', function (e) {
                    if (e.keyCode === 9) { // This will also pick up shift+tab
                        e.preventDefault();
                        _extra.$(divName).focus();
                    }
                });
            }
            }, 1000);*/
        }

    };

});
