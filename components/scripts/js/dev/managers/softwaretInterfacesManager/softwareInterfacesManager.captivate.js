/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("softwareInterfacesManager", function () {

    "use strict";

    function getProjectDimensions(data) {
        if (_extra.captivate.projectContainer.style[data.containerProperty] === "100%") {

            return _extra.w[data.innerProperty];

        } else {

            return _extra.w.parseInt(data.containerSize);

        }
    }

    function getPlaybarClass () {
        if (_extra.w.cp.PB) {

            return _extra.w.cp.PB.PlayBarSlider;

        }

        return false;
    }

    // Define a private object to hold the references to the different points in
    // the Captivate API
    _extra.captivate = {
        "api":_extra.w.cp,
        "FPS": _extra.w.cp.movie.fps,
        "totalFrames": _extra.w.cp.D.project_main.to,
        "version":_extra.w.CaptivateVersion,
        "variables":_extra.w,
        "interface":_extra.w.cpAPIInterface,
        "eventDispatcher":_extra.w.cpAPIEventEmitter,
        "model":_extra.w.cp.model,
        "allSlideObjectsData":_extra.w.cp.model.data,
        "movie":_extra.w.cp.movie,
        "playbar": new _extra.classes.PlaybarProxy(),
        "variableManager": _extra.w.cp.variablesManager,
        "isResponsive": _extra.w.cp.responsive,
        "projectContainer": _extra.w.cp.projectContainer,
        "projectDIV": _extra.w.document.getElementById("project"),
        "audioManager": _extra.w.cp.movie.am,
        "numSlides":_extra.w.cpInfoSlideCount,
        "keyManager": _extra.w.cp.movie.stage.m_keyManager,
        "openURLLocation":_extra.w.cp,
        "openURLMethodName":"openURL",
        "playbarClass":getPlaybarClass(),
        "isInitated": function () {
            return _extra.w.cp.initiated;
        },
        "getResponsiveProjectWidth": function () {
            return _extra.captivate.api.ResponsiveProjWidth;
        },
        "getProjectWidth": function () {

            return getProjectDimensions({
                "containerProperty":"width",
                "innerProperty":"innerWidth",
                "containerSize": _extra.captivate.projectContainer.style.width
            });

        },
        "getProjectHeight": function () {

            return getProjectDimensions({
                "containerProperty":"height",
                "innerProperty":"innerHeight",
                "containerSize": _extra.captivate.projectDIV.style.height
            });

        },
        "events":{
            /**
             * Event Data:
             * - slideNumber
             * - frameNumber
             * - lcpversion (?)
             */
            "SLIDE_ENTER":"CPAPI_SLIDEENTER",
            /**
             * Event Data:
             * - slideNumber
             * - frameNumber
             * - lcpversion (?)
             * - percentageSlideSeen = NUMBER
             */
            "SLIDE_EXIT":"CPAPI_SLIDEEXIT",
            "PLAYBAR_SCRUBBING_BEGIN":"CPAPI_STARTPLAYBARSCRUBBING",
            "PLAYBAR_SCRUBBING_END":"CPAPI_ENDPLAYBARSCRUBBING",
            /**
             * Event Data:
             * - frameNumber
             * - includedInQuiz
             * - issuccess
             * - itemname
             * - objecttype
             * - questioneventdata
             * - slideNumber
             */
            "INTERACTIVE_ITEM_SUBMIT":"CPAPI_INTERACTIVEITEMSUBMIT",
            "MOVIE_PAUSE":"CPAPI_MOVIEPAUSE",
            "MOVIE_RESUME":"CPAPI_MOVIERESUME",
            "MOVIE_START":"CPAPI_MOVIESTART",
            "MOVIE_STOP":"CPAPI_MOVIESTOP",
            /**
             * Event Data:
             * - correctAnswer=STRING;
             * - infiniteAttempts=BOOLEAN;
             * - interactionID=NUMBER;
             * - objectiveID=STRING;
             * - questionAnswered=BOOLEAN;
             * - questionAnsweredCorrectly=BOOLEAN;
             * - questionAttempts=NUMBER;
             * - questionMaxAttempts=NUMBER;
             * - questionMaxScore=NUMBER;
             * - questionNumber=NUMBER;
             * - questionScore=NUMBER;
             * - questionScoringType=[object Object],{Name:STRING};
             * - questionType=STRING;
             * - quizName=STRING;
             * - reportAnswers=BOOLEAN;
             * - selectedAnswer=STRING;
             * - slideNumber=NUMBER;
             */
            "QUESTION_SKIP":"CPAPI_QUESTIONSKIP",
            /**
             * Event Data:
             * - correctAnswer=STRING;
             * - infiniteAttempts=BOOLEAN;
             * - interactionID=NUMBER;
             * - objectiveID=STRING;
             * - questionAnswered=BOOLEAN;
             * - questionAnsweredCorrectly=BOOLEAN;
             * - questionAttempts=NUMBER;
             * - questionMaxAttempts=NUMBER;
             * - questionMaxScore=NUMBER;
             * - questionNumber=NUMBER;
             * - questionScore=NUMBER;
             * - questionScoringType=[object Object],{Name:STRING};
             * - questionType=STRING;
             * - quizName=STRING;
             * - reportAnswers=BOOLEAN;
             * - selectedAnswer=STRING;
             * - slideNumber=NUMBER;
             */
            "QUESTION_SUBMIT":"CPAPI_QUESTIONSUBMIT",
            /**
             * Subscribing to this event requires a third parameter to be passed into the eventListener method.
             * This third parameter should be the name of the Captivate Variable you wish to listen for.
             *
             * Event Data:
             * - captivateVersion=STRING;
             * - varName=STRING;
             * - oldVal=STRIN;
             * - newVal=STRING;
             */
            "VARIABLE_VALUE_CHANGED":"CPAPI_VARIABLEVALUECHANGED"

        }
    };

}, _extra.CAPTIVATE);