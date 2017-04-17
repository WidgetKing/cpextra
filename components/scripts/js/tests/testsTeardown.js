/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 11:14 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    // Get a reference to all the classes (as we may need to instantiate them)
    function callModules(a) {

        var moduleName;
        var moduleFunction;

        for (var i = 0; i < a.length; i += 1) {
            moduleName = a[i];
            moduleFunction = unitTests.modules[moduleName];
            if (moduleFunction) {
                moduleFunction();
                //alert("Loaded: " + moduleName);

                // If the above is not true, we've either written it wrong, or we have a Captivate version
                // and a storyline version of the module.
            } else {


                moduleFunction = unitTests.modules[moduleName + "_" + unitTests.CAPTIVATE];

                if (moduleFunction) {
                    //alert("Loaded: " + moduleName + "_" + unitTests.CAPTIVATE);
                    moduleFunction();
                }

                moduleFunction = unitTests.modules[moduleName + "_" + unitTests.STORYLINE];

                if (moduleFunction) {
                    //alert("Loaded: " + moduleName + "_" + unitTests.STORYLINE);
                    moduleFunction();
                }

            }
        }
    }


    // For some reason when we get here, _extra.w is invalid. So we need to set that now before we start running
    // through some code
    window._extra.w = window;

    callModules(["Callback","BaseSlideObjectDataProxy","TextEntryBoxDataProxy","SlideDataProxy","BaseSlideObjectProxy",
    "SlideObjectStateManager", "StateDataProxy", "ModelListener", "Model", "EventMediator", "DoubleClickHandler",
    "EventDispatcher", "CustomEvent", "PlaybarProxy", "InterruptedClickEventHandler", "VariableEventManager",
    "VariableEventProxy", "SlideObjectEnterExitEventManager", "SlideObjectQuestionDataProxy"]);

    delete window._extra;
}());

