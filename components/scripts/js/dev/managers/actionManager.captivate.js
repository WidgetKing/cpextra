/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule(
  "actionManager",
  ["softwareInterfacesManager"],
  function() {
    "use strict";

    var SUCCESS_CRITERIA = "success",
      FAILURE_CRITERIA = "failure",
      FOCUS_LOST_CRITERIA = "focuslost";

    _extra.actionManager = {
      callActionOn: function(slideObject, criteria) {
        var data = _extra.dataManager.getSlideObjectDataByName(slideObject),
          stringCode;

        if (data) {
          if (data.isInteractiveObject) {
            switch (criteria) {
              case SUCCESS_CRITERIA:
                stringCode = data.successAction;
                break;

              case FAILURE_CRITERIA:
                stringCode = data.failureAction;
                break;

              case FOCUS_LOST_CRITERIA:
                if (data.focusLostAction) {
                  stringCode = data.focusLostAction;
                } else {
                  _extra.error("CV011", slideObject);
                }
                break;

              default:
                break;
            }
          } else {
            _extra.error("CV012", slideObject);
          }
        } else {
          _extra.error("CV013", slideObject);
        }

        // If by the end of this we have some valid javascript to call
        if (stringCode) {
          _extra.captivate.movie.executeAction(stringCode);
        }
      }
    };
  },
  _extra.CAPTIVATE
);
