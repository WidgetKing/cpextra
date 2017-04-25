/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/04/17
 * Time: 1:54 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("alertManager", ["softwareInterfacesManager", "AlertProxy"], function () {

    "use strict";

    var sendInternalAlert = _extra.captivate.api.ShowWarning;

    _extra.alertManager = {

        "sendAlert": function (data) {

            var alert;

            function entryPoint () {

                parseStrings();
                alert = createAlert();
                configureButtonActions();
                alert.show();

            }

            function parseStrings () {

                if (data.message) {
                    data.message = _extra.variableManager.replaceVariablesInString(data.message);
                }

                if (data.title) {
                    data.title = _extra.variableManager.replaceVariablesInString(data.title);
                }

            }

            function createAlert () {
                alert = sendInternalAlert(data.message, data.title, false);
                return new _extra.classes.AlertProxy(alert);
            }

            function configureButtonActions () {

                if (data.firstButtonAction) {

                    var baseFirstButtonAction = alert.getFirstButtonAction();

                    alert.setFirstButtonAction(function () {
                        baseFirstButtonAction();
                        data.firstButtonAction();
                    });

                }

            }

            entryPoint();

        }

    };

}, _extra.CAPTIVATE);